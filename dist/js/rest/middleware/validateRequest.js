import { validateType } from "../../typing";
import { ApiError } from "../ApiError";
import { status } from "../status";
export default function validateJsonBody(reqType) {
    return (req, res, next) => {
        const [_, typeErr] = validateType(reqType, {
            ...req.body,
            ...req.query,
            ...req.params,
        });
        if (typeErr != null) {
            return next(new ApiError({ statusCode: status.BadRequest }, "Bad request", typeErr));
        }
        next();
    };
}
