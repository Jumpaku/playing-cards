import { ApiErr } from "../ApiErr";
export default function sendErrResponse(err, req, res, next) {
    if (err instanceof ApiErr) {
        const info = err.getInfo();
        res.status(info.statusCode).json({
            name: err.name,
            message: err.message,
            info: info,
        });
    }
    next();
}
