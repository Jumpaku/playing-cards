import { validateType } from "../../typing";
import { ApiErr } from "../api_err";
import { status } from "../utils";
export default function validateJsonBody(reqType) {
    return (req, res, next) => {
        const [_, typeErr] = validateType(reqType, {
            ...req.body,
            ...req.query,
            ...req.params,
        });
        if (typeErr != null) {
            return next(new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr));
        }
        next();
    };
}
