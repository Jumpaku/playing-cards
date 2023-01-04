import { NextFunction, Router } from "express";
import typing from "io-ts";
import { assertNonNull, Result } from "../lib/errors";
import { ApiErr, wrapApiErr } from "./api_err";
import { CallContext } from "./call_context";
import { methods, Request, Response, status } from "./utils";
import logRequest from "./middleware/log_request";
import logApiErr from "./middleware/log_api_err";
import sendErrResponse from "./middleware/send_err_response";
import logResponse from "./middleware/log_response";
import endCall from "./middleware/end_call";
import { validateType } from "../lib/typing";
import sendResponse from "./middleware/send_response";
import { AppContext } from "../app/context";
import parseRawBody from "./middleware/parse_raw_body";
import parseJsonBody from "./middleware/parse_json_body";
import { newApiCallInfo } from "./api_log";
import { newErrLogInfo } from "../lib/log/err_log_info";

export type Handler<Req, Res> = (
  appCtx: AppContext,
  callCtx: CallContext,
  req: Req
) => Promise<Result<Res, ApiErr>>;

export function route<Req, Res>(
  appCtx: AppContext,
  router: Router,
  method: typeof methods[number],
  path: string,
  reqType: typing.Type<Req>,
  handler: Handler<Req, Res>
) {
  const wrappedHandler = async (
    req: Request<Res, Req>,
    res: Response<Res>,
    next: NextFunction
  ) => {
    const callCtx = req.callCtx;
    assertNonNull(callCtx);
    // Validate request args
    const [args, typeErr] = validateType(reqType, {
      ...req.body,
      ...req.query,
      ...req.params,
    });
    if (typeErr != null) {
      return next(
        new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr)
      );
    }
    try {
      // Invoke handler with args
      const result = await handler(appCtx, callCtx, args);
      appCtx.log.info(newApiCallInfo(callCtx, args, result));
      const [resBody, apiErr] = result;
      if (apiErr != null) {
        return next(apiErr);
      }
      res.body = resBody;
    } catch (err) {
      // Handle error when await failed
      appCtx.log.error(newErrLogInfo(err));
      return next(wrapApiErr(err));
    }
    next();
  };

  router[method](path, [
    parseRawBody,
    logRequest(appCtx),
    parseJsonBody,

    wrappedHandler,
    sendResponse,

    logApiErr(appCtx),
    sendErrResponse,

    logResponse(appCtx),
    endCall,
  ]);
}
