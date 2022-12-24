import { wrapErr } from "../../lib/errors";
import { ApiErr } from "../api_err";
import { status } from "../utils";
export default function parseJsonBody(req, res, next) {
    try {
        const raw = req.rawBody ?? "";
        req.body = raw === "" ? {} : JSON.parse(raw);
        next();
    }
    catch (err) {
        next(new ApiErr("Cannot parse body as JSON", { statusCode: status.BadRequest }, wrapErr(err)));
    }
}
