import { NextFunction, Router } from "express";
import typing from "io-ts";
import { Result } from "../lib/errors";
import { ApiErr } from "./api_err";
import { CallContext } from "./call_context";
import { methods, Request, Response, status } from "./utils";
import { json } from "body-parser";
import catchParseJsonErr from "./middleware/catch_parse_json_err";
import logRequest from "./middleware/log_request";
import catchUnexpectedErr from "./middleware/catch_unexpected_err";
import logApiErr from "./middleware/log_api_err";
import sendErrResponse from "./middleware/send_err_response";
import logResponse from "./middleware/log_response";
import endCall from "./middleware/end_call";
import { validateType } from "../lib/typing";
import sendResponse from "./middleware/send_response";
import { AppContext } from "../app/context";
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
    return (async () => {
      const args = { ...req.body, ...req.query, ...req.params };
      const [_, typeErr] = validateType(reqType, args);
      if (typeErr != null) {
        return next(
          new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr)
        );
      }
      const [result, apiErr] = await handler(req.ctx!, args);
      if (apiErr != null) {
        return next(apiErr);
      }
      res.body = result;
      next();
    })().catch(next);
  };

  app[method](path, [
    json({ strict: true, inflate: false }),
    catchParseJsonErr,
    logRequest(),

    wrappedHandler,
    sendResponse,

    catchUnexpectedErr,
    logApiErr(),
    sendErrResponse,

    logResponse(),
    endCall,
  ]);
}
