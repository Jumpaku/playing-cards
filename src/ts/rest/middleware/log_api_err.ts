import { NextFunction } from "express";
import { AppContext } from "../../app/context";
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
export default function logApiErr(appCtx: AppContext) {
  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    const callCtx = req.callCtx;
    requireNonNull(callCtx);
    const apiErr = wrapApiErr(err);
    const errInfo: ErrorInfo = {
      name: "api_err_log",
      logTime: appCtx.clock.now(),
      callId: callCtx.callId,
      info: apiErr.getInfo(),
      message: apiErr.chainMessage(),
    };
    appCtx.log.info(errInfo);
    next(apiErr);
  };
}
