import { BaseError } from "./BaseError";
import { wrapErr } from "./utils";
export class ApiError extends BaseError {
    statusCode;
    static wrap(statusCode, err) {
        return new ApiError(statusCode, `wrap with status code ${statusCode}`, wrapErr(err));
    }
    constructor(statusCode, message, cause) {
        super("AppError", message, cause);
        this.statusCode = statusCode;
    }
    getInfo() {
        return { statusCode: this.statusCode };
    }
}
