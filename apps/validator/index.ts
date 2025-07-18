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

async function main() {
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!))
  );
  const ws = new WebSocket('ws://localhost:8081');

  ws.onmessage = async (event) => {
    const data: OutgoingMsg = JSON.parse(event.data);

    if (data.type === 'signUp') {
      CALLBACKS[data.data.callbackId]?.(data.data);
      delete CALLBACKS[data.data.callbackId];
    } else if (data.type === 'validate') {
      await validateHandler(ws, data.data, keypair);
    }
  };

  ws.onopen = async () => {
    const callbackId = randomUUIDv7();
    CALLBACKS[callbackId] = (data: SignUpOutgoingMsg) => {
      validatorId = data.validatorId;
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
}

async function validateHandler(
  ws: WebSocket,
  { url, callbackId, websiteId }: ValidateOutgoingMsg,
  keypair: Keypair
) {
  const startTime = Date.now();
  const signature = await signMessage(`Replying to ${callbackId}`, keypair);

  try {
    const res = await fetch(url);
    const endTime = Date.now();
    const latencey = endTime - startTime;
    const status = res.status;

    ws.send(
      JSON.stringify({
        type: 'validate',
        data: {
          callbackId,
          status: status === 200 ? 'Good' : 'Bad',
          latencey,
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
          latencey: -1,
          websiteId,
          signedMsg: signature,
          validatorId,
        },
      })
    );
  }
}

async function signMessage(message: string, keypair: Keypair) {
  const msgBytes = nacl_util.decodeUTF8(message);
  const signature = nacl.sign.detached(msgBytes, keypair.secretKey);

  return JSON.stringify(Array.from(signature));
}

main();

setInterval(async () => {}, 10000);
