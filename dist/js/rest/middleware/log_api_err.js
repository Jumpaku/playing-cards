import { requireNonNull } from "../../lib/errors";
import { wrapApiErr } from "../api_err";
export default function logApiErr(ctx) {
    return (err, req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        const apiErr = wrapApiErr(err);
        const errInfo = {
            name: "api_err_log",
            logTime: new Date(),
            callId: callCtx.callId,
            info: apiErr.getInfo(),
            message: apiErr.chainMessage(),
        };
        ctx.log.info(errInfo);
        next(apiErr);
    };
}
