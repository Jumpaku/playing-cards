import { json } from "express";
import { requireNonNull } from "../lib/errors";
import { ApiErr, wrapApiErr } from "./api_err";
import { status } from "./utils";
import logRequest from "./middleware/log_request";
import logApiErr from "./middleware/log_api_err";
import sendErrResponse from "./middleware/send_err_response";
import logResponse from "./middleware/log_response";
import endCall from "./middleware/end_call";
import { validateType } from "../lib/typing";
import sendResponse from "./middleware/send_response";
import catchParseJsonErr from "./middleware/parse_json_body";
import parseRawBody from "./middleware/parse_raw_body";
export function route(ctx, app, method, path, reqType, handler) {
    const wrappedHandler = async (req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        // Validate request args
        const [args, typeErr] = validateType(reqType, {
            ...req.body,
            ...req.query,
            ...req.params,
        });
        if (typeErr != null) {
            return next(new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr));
        }
        try {
            // Invoke handler with args
            const [result, apiErr] = await handler(callCtx, args);
            if (apiErr != null) {
                return next(apiErr);
            }
            res.body = result;
        }
        catch (err) {
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
