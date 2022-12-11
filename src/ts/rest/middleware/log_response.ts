import { NextFunction } from "express";
import { OutgoingHttpHeaders } from "http";
import { requireNonNull } from "../../lib/errors";
import { LogInfo } from "../../lib/log/log_info";
import { Request, Response, Status } from "../utils";

export type ResponseInfo = LogInfo & {
  name: "response_log";
  callId: string;
  status: Status[keyof Status];
  headers: OutgoingHttpHeaders;
  body: unknown;
};
export default function logResponse(
  cout: Console["log"] = console.log.bind(console)
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const callCtx = req.ctx;
    requireNonNull(callCtx);
    const resInfo: ResponseInfo = {
      name: "response_log",
      timestamp: new Date(Date.now()),
      callId: callCtx.callId,
      status: res.statusCode as Status[keyof Status],
      headers: res.getHeaders(),
      body: res.body,
    };
    cout(JSON.stringify(resInfo));
    next();
  };
}
