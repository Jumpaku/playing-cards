import { requireNonNull } from "../../lib/errors";
export default function logResponse(ctx) {
    return (req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        const resInfo = {
            name: "response_log",
            logTime: new Date(),
            callId: callCtx.callId,
            status: res.statusCode,
            headers: res.getHeaders(),
            body: res.body,
        };
        ctx.log.info(resInfo);
        next();
    };
}
