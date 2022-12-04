import { AppContext } from "../context";

export type RequestContext = {
  app: AppContext;
  token: string;
  timestamp: Date;
};
