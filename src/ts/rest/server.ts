import express, { NextFunction, Router } from "express";
import { AppContext } from "../app/context";
import prepareCallContext from "./middleware/prepare_call_context";
import sendErrResponse from "./middleware/send_err_response";
import logResponse from "./middleware/log_response";
import logApiErr from "./middleware/log_api_err";
import { ApiErr } from "./api_err";
import { Request, Response, status } from "./utils";
import logRequest from "./middleware/log_request";
import parseRawBody from "./middleware/parse_raw_body";
import { Server } from "http";

export function server(
  ctx: AppContext,
  routing: (router: Router) => void,
  callback: (s: Server) => void
) {
  const router = express.Router();
  router.use(prepareCallContext(ctx));
  routing(router);
  routeDefault(ctx, router);

  const app = express();
  app.use(router);
  const s = app.listen(ctx.env.APP_PORT, () => {
    console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
  });
  callback(s);
}

function routeDefault(ctx: AppContext, router: Router): Router {
  const throwApiNotFound = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    next(new ApiErr("API not found", { statusCode: status.NotFound }));
  };
  router.use([
    parseRawBody,
    logRequest(ctx),
    throwApiNotFound,
    logApiErr(ctx),
    sendErrResponse,
    logResponse(ctx),
  ]);
  return router;
}
