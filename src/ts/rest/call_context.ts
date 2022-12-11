import { AppContext } from "../app/context";

export type CallContext = {
  app: AppContext;
  callId: string;
  token: string;
  timestamp: Date;
};
