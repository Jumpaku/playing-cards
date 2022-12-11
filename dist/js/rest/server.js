import express from "express";
import prepareCallContext from "./middleware/prepare_call_context";
import sendErrResponse from "./middleware/send_err_response";
import logResponse from "./middleware/log_response";
import logApiErr from "./middleware/log_api_err";
import { ApiErr } from "./api_err";
import { status } from "./utils";
import logRequest from "./middleware/log_request";
import parseRawBody from "./middleware/parse_raw_body";
export function server(ctx, routing) {
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
function routeDefault(router) {
    const throwApiNotFound = (req, res, next) => {
        next(new ApiErr("API not found", { statusCode: status.NotFound }));
    };
    router.use([
        parseRawBody,
        logRequest,
        throwApiNotFound,
        logApiErr(),
        sendErrResponse,
        logResponse,
    ]);
    return router;
}
