import { requireNonNull } from "../../lib/errors";
export default function logResponse(cout = console.log.bind(console)) {
    return (req, res, next) => {
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
        cout(JSON.stringify(resInfo));
        next();
    };
}
