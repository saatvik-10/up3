import { randomUUIDv7, type ServerWebSocket } from 'bun';

console.log('Hub started');
import type { IncomingMsg, SignUpIncomingMsg } from 'common/types';
import { prismaClient } from 'db/client';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import nacl_util from 'tweetnacl-util';

const availableValidators: {
  validatorId: string;
  socket: ServerWebSocket;
  publicKey: string;
}[] = [];

const CALLBACKS: { [callbackId: string]: (data: IncomingMsg) => void } = {};

const COST_PER_VALIDATION = 100; // in lamports

// Add HTTP health check endpoint and WebSocket server for Render
Bun.serve({
  port: process.env.PORT || 8081,
  fetch(req, server) {
    const url = new URL(req.url);
    if (
      url.pathname === '/' ||
      url.pathname === '/dashboard' ||
      url.pathname === '/healthz'
    ) {
      return new Response('Hub is healthy', { status: 200 });
    }
    if (server.upgrade(req)) {
      return;
    }
    return new Response('Not found', { status: 404 });
  },
  websocket: {
    async message(ws: ServerWebSocket, message: string) {
      console.log('Received message:', message);
      const data: IncomingMsg = JSON.parse(message);

      if (data.type === 'signUp') {
        const verified = await verifyMessage(
          `Signed msg for ${data.data.callbackId}, ${data.data.publicKey}`,
          data.data.publicKey,
          data.data.signedMsg
        );

        if (verified) {
          console.log('SignUp verified for publicKey:', data.data.publicKey);
          await signUpHandler(ws, data.data);
        } else {
          console.log(
            'SignUp verification failed for publicKey:',
            data.data.publicKey
          );
        }
      } else if (data.type === 'validate') {
        CALLBACKS[data.data.callbackId](data);
        delete CALLBACKS[data.data.callbackId];
      }
    },
    async close(ws: ServerWebSocket) {
      availableValidators.splice(
        availableValidators.findIndex((i) => i.socket === ws),
        1
      );
    },
  },
});

async function signUpHandler(
  ws: ServerWebSocket,
  { ip, publicKey, signedMsg, callbackId }: SignUpIncomingMsg
) {
  const validator = await prismaClient.validator.findFirst({
    where: {
      publicKey,
    },
  });

  if (validator) {
    console.log('Validator already exists, id:', validator.id);
    ws.send(
      JSON.stringify({
        type: 'signUp',
        data: {
          callbackId,
          validatorId: validator.id,
        },
      })
    );

    availableValidators.push({
      validatorId: validator.id,
      socket: ws,
      publicKey: validator.publicKey,
    });
    return;
  }

  const newValidator = await prismaClient.validator.create({
    data: {
      ip,
      publicKey,
      location: 'unknown',
    },
  });

  console.log('New validator created, id:', newValidator.id);
  ws.send(
    JSON.stringify({
      type: 'signUp',
      data: {
        callbackId,
        validatorId: newValidator.id,
      },
    })
  );

  availableValidators.push({
    validatorId: newValidator.id,
    socket: ws,
    publicKey: newValidator.publicKey,
  });
}

async function verifyMessage(
  message: string,
  publicKey: string,
  signature: string
) {
  const msgBytes = nacl_util.decodeUTF8(message);
  const res = nacl.sign.detached.verify(
    msgBytes,
    new Uint8Array(JSON.parse(signature)),
    new PublicKey(publicKey).toBytes()
  );
  return res;
}

setInterval(async () => {
  const allWebsites = await prismaClient.website.findMany({
    where: {
      disabled: false,
    },
  });

  console.log('Websites found:', allWebsites.length);

  for (const website of allWebsites) {
    availableValidators.forEach((validator) => {
      const callbackId = randomUUIDv7();
      console.log(
        `Sending validate to ${validator.validatorId} ${website.url}`
      );
      validator.socket.send(
        JSON.stringify({
          type: 'validate',
          data: {
            callbackId,
            url: website.url,
          },
        })
      );

      CALLBACKS[callbackId] = async (data: IncomingMsg) => {
        if (data.type == 'validate') {
          const { validatorId, status, latency, signedMsg } = data.data;
          const verified = await verifyMessage(
            `Replying to ${callbackId}`,
            validator.publicKey,
            signedMsg
          );
          if (!verified) {
            console.log('Validation reply signature failed for', validatorId);
            return;
          }
          await prismaClient.$transaction(async (tx) => {
            await tx.websiteTick.create({
              data: {
                websiteId: website.id,
                validatorId,
                status,
                latency,
                createdAt: new Date(),
              },
            });

            await tx.validator.update({
              where: {
                id: validatorId,
              },
              data: {
                pendingPayouts: {
                  increment: COST_PER_VALIDATION,
                },
              },
            });
          });
        }
      };
    });
  }
}, 60 * 1000);
