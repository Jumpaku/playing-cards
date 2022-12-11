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
  rawBody: unknown;
  params: unknown;
  query: unknown;
};

export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const callCtx = req.ctx;
  requireNonNull(callCtx);
  const reqInfo: RequestInfo = {
    name: "request_log",
    timestamp: new Date(Date.now()),
    callId: callCtx.callId,
    method: req.method.toLowerCase() as Method,
    url: req.url,
    headers: req.headers,
    rawBody: req.rawBody,
    params: req.params,
    query: req.query,
  };
  callCtx.app.log.info(reqInfo);
  next();
}
