import { wrapApiErr } from "../api_err";
export default function sendErrResponse(err, req, res, next) {
    const apiErr = wrapApiErr(err);
    res.body = apiErr.asResponse();
    res.status(apiErr.getInfo().statusCode).json(res.body);
    next();
}
