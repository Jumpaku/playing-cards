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
import parseRawBody from "./middleware/parse_raw_body";
import { newErrorLogInfo } from "../lib/log/log_info";
import parseJsonBody from "./middleware/parse_json_body";
export function route(ctx, router, method, path, handler) {
    const wrappedHandler = async (req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        // Validate request args
        const [args, typeErr] = validateType(handler.requestType, {
            ...req.body,
            ...req.query,
            ...req.params,
        });
        if (typeErr != null) {
            return next(new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr));
        }
        try {
            // Invoke handler with args
            const [result, apiErr] = await handler.handle(callCtx, args);
            if (apiErr != null) {
                return next(apiErr);
            }
            res.body = result;
        }
        catch (err) {
            // Handle error when await failed
            callCtx.app.log.error(newErrorLogInfo(err));
            return next(wrapApiErr(err));
        }
        next();
    };
    router[method](path, [
        parseRawBody,
        logRequest(ctx),
        parseJsonBody,
        wrappedHandler,
        sendResponse,
        logApiErr(ctx),
        sendErrResponse,
        logResponse(ctx),
        endCall,
    ]);
}
