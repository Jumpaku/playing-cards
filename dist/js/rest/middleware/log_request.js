import { requireNonNull } from "../../lib/errors";
export default function logRequest(ctx) {
    return (req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        const reqInfo = {
            name: "request_log",
            timestamp: new Date(),
            callId: callCtx.callId,
            method: req.method.toLowerCase(),
            url: req.url,
            headers: req.headers,
            rawBody: req.rawBody,
            params: req.params,
            query: req.query,
        };
        ctx.log.info(reqInfo);
        next();
    };
}
