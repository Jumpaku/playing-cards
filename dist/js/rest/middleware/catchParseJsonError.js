import { wrapErr } from "../../errors";
import { ApiError } from "../ApiError";
import { status } from "../status";
export default function catchParseJsonError(err, req, res, next) {
    next(new ApiError({ statusCode: status.BadRequest }, "cannot parse json", wrapErr(err)));
}
