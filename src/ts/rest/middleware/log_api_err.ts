import { NextFunction } from "express";
import { requireNonNull } from "../../lib/errors";
import { LogInfo } from "../../lib/log/log_info";
import { ApiErr } from "../api_err";
import { Request, Response } from "../utils";

export type ErrorInfo = LogInfo & {
  name: "api_err_log";
  callId: string;
  info: unknown;
  message: string;
};
export default function logApiErr(
  cout: Console["log"] = console.log.bind(console),
  cerr: Console["error"] = console.error.bind(console)
) {
  return (err: ApiErr, req: Request, res: Response, next: NextFunction) => {
    const callCtx = req.ctx;
    requireNonNull(callCtx);
    const resInfo: ErrorInfo = {
      name: "api_err_log",
      timestamp: new Date(Date.now()),
      callId: callCtx.callId,
      info: err.getInfo(),
      message: err.chainMessage(),
    };
    cout(JSON.stringify(resInfo));
    err.print(cerr);
    next(err);
  };
}
