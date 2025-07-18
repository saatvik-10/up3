import { randomUUIDv7, type ServerWebSocket } from 'bun';
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

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      // upgrades http request to websocket request
      return;
    }
    return new Response('Upgrade failed', { status: 500 });
  },
  port: 8081,
  websocket: {
    async message(ws: ServerWebSocket, message: string) {
      const data: IncomingMsg = JSON.parse(message);

      if (data.type === 'signUp') {
        const verified = await verifyMessage(
          `Signed msg for ${data.data.callbackId}, ${data.data.publicKey}`,
          data.data.signedMsg,
          data.data.publicKey
        );

        if (verified) {
          await signUpHandler(ws, data.data);
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
      validatorId: validator?.id,
      socket: ws,
      publicKey: validator?.publicKey,
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

  for (const website of allWebsites) {
    availableValidators.forEach((validator) => {
      const callbackId = randomUUIDv7();
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
            `Reply to ${callbackId}`,
            validator.publicKey,
            signedMsg
          );
          if (!verified) {
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
