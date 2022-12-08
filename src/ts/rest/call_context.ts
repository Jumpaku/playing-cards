import { AppContext } from "../app/context";

export type CallContext = {
  app: AppContext;
  token: string;
  timestamp: Date;
};
