import { NextFunction } from "express";
import { IncomingHttpHeaders } from "http";
import { requireNonNull } from "../../lib/errors";
import { LogInfo } from "../../lib/log/log_info";
import { Method, Request, Response } from "../utils";

export type RequestInfo = LogInfo & {
  name: "request_log";
  callId: string;
  method: Method;
  url: string;
  headers: IncomingHttpHeaders;
  body: unknown;
  params: unknown;
  query: unknown;
};
export default function logRequest(
  cout: Console["log"] = console.log.bind(console)
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const callCtx = req.ctx;
    requireNonNull(callCtx);
    const reqInfo: RequestInfo = {
      name: "request_log",
      timestamp: new Date(Date.now()),
      callId: callCtx.callId,
      method: req.method.toLowerCase() as Method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
    };
    cout(JSON.stringify(reqInfo));
    next();
  };
}
