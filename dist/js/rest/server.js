import express from "express";
import { json } from "body-parser";
import catchParseJsonError from "./middleware/catchParseJsonError";
import sendResponse from "./middleware/sendResponse";
import sendErrorResponse from "./middleware/sendErrorResponse";
import catchUnexpectedError from "./middleware/catchUnexpectedError";
import newRequestContext from "./middleware/newRequestContext";
export function server(ctx, routing) {
    const app = express();
    app.use(json({ strict: true, inflate: false }));
    app.use(catchParseJsonError);
    app.use(newRequestContext);
    routing(app);
    /*
     * App.use(path, validateJsonBody(Env));
     * app[method](path, handler(Env));
     */
    app.use(sendResponse);
    app.use(catchUnexpectedError);
    app.use(sendErrorResponse);
    app.listen(ctx.env.APP_PORT, () => {
        console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
    });
}
