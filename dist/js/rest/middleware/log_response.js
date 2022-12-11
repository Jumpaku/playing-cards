import { requireNonNull } from "../../lib/errors";
export default function logResponse(req, res, next) {
    const callCtx = req.ctx;
    requireNonNull(callCtx);
    const resInfo = {
        name: "response_log",
        timestamp: new Date(Date.now()),
        callId: callCtx.callId,
        status: res.statusCode,
        headers: res.getHeaders(),
        body: res.body,
    };
    callCtx.app.log.info(resInfo);
    next();
}
