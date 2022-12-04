import { wrapErr } from "../../errors";
import { ApiErr } from "../api_err";
import { status } from "../status";
export default function catchUnexpectedErr(err, req, res, next) {
    const apiErr = err instanceof ApiErr
        ? err
        : new ApiErr("Unexpected Error", { statusCode: status.InternalServerError }, wrapErr(err));
    next(apiErr);
}
