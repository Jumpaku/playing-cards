import { json, NextFunction, Router } from "express";
import typing from "io-ts";
import { requireNonNull, Result } from "../lib/errors";
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
import catchParseJsonErr from "./middleware/parse_json_body";
import parseRawBody from "./middleware/parse_raw_body";

export type Handler<Req, Res> = (
  ctx: CallContext,
  req: Req
) => Promise<Result<Res, ApiErr>>;

export function route<Req, Res>(
  ctx: AppContext,
  app: Router,
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
    const callCtx = req.ctx;
    requireNonNull(callCtx);
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
      const [result, apiErr] = await handler(callCtx, args);
      if (apiErr != null) {
        return next(apiErr);
      }
      res.body = result;
    } catch (err) {
      // Handle error when await failed
      return next(wrapApiErr(err));
    }
    next();
  };

  app[method](path, [
    parseRawBody,
    logRequest,
    json({ strict: true, inflate: false }),
    catchParseJsonErr,

    wrappedHandler,
    sendResponse,

    logApiErr(),
    sendErrResponse,

    logResponse,
    endCall,
  ]);
}
