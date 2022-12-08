import { wrapErr } from "../../lib/errors";
import { ApiErr } from "../api_err";
import { status } from "../utils";
export default function catchUnexpectedErr(err, req, res, next) {
    const apiErr = err instanceof ApiErr
        ? err
        : new ApiErr("Unexpected Error", { statusCode: status.InternalServerError }, wrapErr(err));
    next(apiErr);
}
