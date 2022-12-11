import { NextFunction } from "express";
import { requireNonNull } from "../../lib/errors";
import { LogInfo } from "../../lib/log/log_info";
import { wrapApiErr } from "../api_err";
import { Request, Response } from "../utils";

export type ErrorInfo = LogInfo & {
  name: "api_err_log";
  callId: string;
  info: unknown;
  message: string;
};
export default function logApiErr(
  cerr: Console["error"] = console.error.bind(console)
) {
  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    const callCtx = req.ctx;
    requireNonNull(callCtx);
    const apiErr = wrapApiErr(err);
    const errInfo: ErrorInfo = {
      name: "api_err_log",
      timestamp: new Date(Date.now()),
      callId: callCtx.callId,
      info: apiErr.getInfo(),
      message: apiErr.chainMessage(),
    };
    callCtx.app.log.warn(errInfo);
    apiErr.print(cerr);
    next(apiErr);
  };
}
