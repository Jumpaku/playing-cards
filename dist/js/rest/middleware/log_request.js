import { requireNonNull } from "../../lib/errors";
export default function logRequest(cout = console.log.bind(console)) {
    return (req, res, next) => {
        const callCtx = req.ctx;
        requireNonNull(callCtx);
        const reqInfo = {
            name: "request_log",
            timestamp: new Date(Date.now()),
            callId: callCtx.callId,
            method: req.method.toLowerCase(),
            url: req.url,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query,
        };
        cout(JSON.stringify(reqInfo));
        next();
    };
}
