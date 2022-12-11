import { requireNonNull } from "../../lib/errors";
export default function logApiErr(cout = console.log.bind(console), cerr = console.error.bind(console)) {
    return (err, req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        const resInfo = {
            name: "api_err_log",
            timestamp: new Date(Date.now()),
            callId: callCtx.callId,
            info: err.getInfo(),
            message: err.chainMessage(),
        };
        cout(JSON.stringify(resInfo));
        err.print(cerr);
        next(err);
    };
}
