import express from "express";
import { json } from "body-parser";
import catchParseJsonErr from "./middleware/catchParseJsonErr";
import sendResponse from "./middleware/sendResponse";
import sendErrResponse from "./middleware/sendErrResponse";
import catchUnexpectedErr from "./middleware/catchUnexpectedErr";
import newRequestContext from "./middleware/newRequestContext";
export function server(ctx, routing) {
    const app = express();
    app.use(json({ strict: true, inflate: false }));
    app.use(catchParseJsonErr);
    app.use(newRequestContext);
    routing(app);
    /*
     * App.use(path, validateJsonBody(Env));
     * app[method](path, handler(Env));
     */
    app.use(sendResponse);
    app.use(catchUnexpectedErr);
    app.use(sendErrResponse);
    app.listen(ctx.env.APP_PORT, () => {
        console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
    });
}
