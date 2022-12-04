import { wrapErr } from "../../errors";
import { ApiErr } from "../api_err";
import { status } from "../status";
export default function catchParseJsonErr(err, req, res, next) {
    next(new ApiErr("cannot parse json", { statusCode: status.BadRequest }, wrapErr(err)));
}
