import express from "express";
import { json } from "body-parser";
import catchParseJsonErr from "./middleware/catch_parse_json_err";
import sendResponse from "./middleware/send_response";
import sendErrResponse from "./middleware/send_err_response";
import catchUnexpectedErr from "./middleware/catch_unexpected_err";
import prepareCallContext from "./middleware/prepare_call_context";
import { api_route } from "./api/gen/api_route";
export function server(ctx, routing) {
    const app = express();
    app.use(json({ strict: true, inflate: false }));
    app.use(catchParseJsonErr);
    app.use(prepareCallContext);
    routing(app);
    /*
     * App.use(path, validateJsonBody(Env));
     */
    api_route(app);
    app.use(sendResponse);
    app.use(catchUnexpectedErr);
    app.use(sendErrResponse);
    app.listen(ctx.env.APP_PORT, () => {
        console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
    });
}
