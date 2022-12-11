import { requireNonNull } from "../../lib/errors";
import { wrapApiErr } from "../api_err";
export default function logApiErr(cerr = console.error.bind(console)) {
    return (err, req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        const apiErr = wrapApiErr(err);
        const errInfo = {
            name: "api_err_log",
            timestamp: new Date(Date.now()),
            callId: callCtx.callId,
            info: apiErr.getInfo(),
            message: apiErr.chainMessage(),
        };
        callCtx.app.log.warn(errInfo);
        apiErr.print(cerr);
        next(apiErr);
    };
}
