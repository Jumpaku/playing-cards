import { AppContext } from "../app/context";

export type CallContext = {
  app: AppContext;
  callId: string;
  callTime: Date;
  token: string;
};
