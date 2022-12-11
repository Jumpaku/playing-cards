import { wrapApiErr } from "../api_err";
export default function sendErrResponse(err, req, res, next) {
    const apiErr = wrapApiErr(err);
    const info = apiErr.getInfo();
    res.body = {
        name: apiErr.name,
        message: apiErr.message,
        info: info,
    };
    res.status(info.statusCode).json(res.body);
    next();
}
