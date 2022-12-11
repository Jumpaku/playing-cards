import express, { Router } from "express";
import { AppContext } from "../app/context";
import { text } from "body-parser";
import prepareCallContext from "./middleware/prepare_call_context";
import sendErrResponse from "./middleware/send_err_response";
import catchUnexpectedErr from "./middleware/catch_unexpected_err";
import logResponse from "./middleware/log_response";
import logApiErr from "./middleware/log_api_err";
import { ApiErr } from "./api_err";
import { status } from "./utils";
import logRequest from "./middleware/log_request";

export function server(ctx: AppContext, routing: (router: Router) => void) {
  const router = express.Router();
  router.use(prepareCallContext(ctx));
  routing(router);
  routeDefault(router);

  const app = express();
  app.use(router);
  app.listen(ctx.env.APP_PORT, () => {
    console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
  });
}

function routeDefault(router: Router): Router {
  router.use(text({ defaultCharset: "utf8" }));
  router.use(logRequest());
  router.use((req, res, next) => {
    next(new ApiErr("API not found", { statusCode: status.NotFound }));
  });
  router.use(catchUnexpectedErr);
  router.use(logApiErr());
  router.use(sendErrResponse);
  router.use(logResponse());
  return router;
}
