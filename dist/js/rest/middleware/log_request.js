import { requireNonNull } from "../../lib/errors";
export default function logRequest(req, res, next) {
    const callCtx = req.ctx;
    requireNonNull(callCtx);
    const reqInfo = {
        name: "request_log",
        timestamp: new Date(Date.now()),
        callId: callCtx.callId,
        method: req.method.toLowerCase(),
        url: req.url,
        headers: req.headers,
        rawBody: req.rawBody,
        params: req.params,
        query: req.query,
    };
    callCtx.app.log.info(reqInfo);
    next();
}
