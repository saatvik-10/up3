import dotenv from 'dotenv';
dotenv.config();

import { randomUUIDv7 } from 'bun';
import type {
  OutgoingMsg,
  SignUpOutgoingMsg,
  ValidateOutgoingMsg,
} from 'common/types';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import nacl_util from 'tweetnacl-util';

const CALLBACKS: { [callbackId: string]: (data: SignUpOutgoingMsg) => void } =
  {};

let validatorId: string | null = null;

// Add a robust HTTP server for Render health checks
const server = Bun.serve({
  port: process.env.PORT || 3100,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/dashboard' || url.pathname === '/healthz') {
      return new Response('Validator is healthy', { status: 200 });
    }
    return new Response('Not found', { status: 404 });
  },
});

console.log(`Validator HTTP/health server running on port ${server.port}`);

async function main() {
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!))
  );

  console.log('Validator started');
  console.log('Connecting to hub');

  const HUB_URL = process.env.HUB_URL ?? 'ws://localhost:8081';
  const ws = new WebSocket(HUB_URL);

  ws.onmessage = async (event) => {
    console.log('Received message:', event.data);
    const data: OutgoingMsg = JSON.parse(event.data);

    if (data.type === 'signUp') {
      CALLBACKS[data.data.callbackId]?.(data.data);
      delete CALLBACKS[data.data.callbackId];
    } else if (data.type === 'validate') {
      await validateHandler(ws, data.data, keypair);
    }
  };

  ws.onopen = async () => {
    console.log('WebSocket connection established');
    const callbackId = randomUUIDv7();
    CALLBACKS[callbackId] = (data: SignUpOutgoingMsg) => {
      validatorId = data.validatorId;
      console.log('Validator registered with ID:', validatorId);
    };
    const signedMsg = await signMessage(
      `Signed msg for ${callbackId}, ${keypair.publicKey}`,
      keypair
    );

    ws.send(
      JSON.stringify({
        type: 'signUp',
        data: {
          publicKey: keypair.publicKey,
          callbackId,
          signedMsg,
          ip: '127.0.0.1',
        },
      })
    );
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason);
  };
}

async function validateHandler(
  ws: WebSocket,
  { url, callbackId, websiteId }: ValidateOutgoingMsg,
  keypair: Keypair
) {
  console.log(`Validating ${url}`);
  const startTime = Date.now();
  const signature = await signMessage(`Replying to ${callbackId}`, keypair);

  try {
    const res = await fetch(url);
    const endTime = Date.now();
    const latency = endTime - startTime;
    const status = res.status;

    console.log(url);
    console.log(status);
    ws.send(
      JSON.stringify({
        type: 'validate',
        data: {
          callbackId,
          status: status === 200 ? 'Good' : 'Bad',
          latency,
          websiteId,
          signedMsg: signature,
          validatorId,
        },
      })
    );
  } catch (err) {
    ws.send(
      JSON.stringify({
        type: 'validate',
        data: {
          callbackId,
          status: 'Bad',
          latency: -1,
          websiteId,
          signedMsg: signature,
          validatorId,
        },
      })
    );
    console.error(err);
  }
}

async function signMessage(message: string, keypair: Keypair) {
  const msgBytes = nacl_util.decodeUTF8(message);
  const signature = nacl.sign.detached(msgBytes, keypair.secretKey);

  return JSON.stringify(Array.from(signature));
}

main();

setInterval(async () => {}, 10000);
