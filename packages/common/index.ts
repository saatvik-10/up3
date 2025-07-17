export interface SignUpIncomingMsg {
  // from validator to hub
  ip: string;
  publicKey: string;
  signedMsg: string; // web3 signature for authentication
  callbackId: string;
}

export interface ValidateIncomingMsg {
  // from validator to hub
  callbackId: string;
  signedMsg: string;
  status: 'Good' | 'Bad';
  latency: number;
  websiteId: string;
  validatorId: string;
}

export interface SignUpOutgoingMsg {
  // from hub to validator
  callbackId: string;
  validatorId: string;
}

export interface ValidateOutgoingMsg {
  // from hub to validator
  url: string;
  callbackId: string;
  websiteId: string;
}

export type IncomingMsg =
  | {
      // from validator to hub
      type: 'signUp';
      data: SignUpIncomingMsg;
    }
  | {
      type: 'validate';
      data: ValidateIncomingMsg;
    };

export type OutgoingMsg =
  | {
      // from hub to validator
      type: 'signUp';
      data: SignUpOutgoingMsg;
    }
  | {
      type: 'validate';
      data: ValidateOutgoingMsg;
    };
