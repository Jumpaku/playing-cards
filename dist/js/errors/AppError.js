import { UnknownError } from "./UnknownError";
import { BaseError } from "./BaseError";
export class AppError extends BaseError {
    statusCode;
    static wrap(statusCode, err) {
        return new AppError(statusCode, `with status code ${statusCode}`, UnknownError.wrap(err));
    }
    constructor(statusCode, message, cause) {
        super("AppError", message, cause);
        this.statusCode = statusCode;
    }
}
