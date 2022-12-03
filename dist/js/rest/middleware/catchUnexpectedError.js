import { wrapErr } from "../../errors";
import { ApiError } from "../ApiError";
import { status } from "../status";
export default function catchUnexpectedError(err, req, res, next) {
    const apiErr = err instanceof ApiError
        ? err
        : new ApiError({ statusCode: status.InternalServerError }, "Unexpected Error", wrapErr(err));
    next(apiErr);
}
