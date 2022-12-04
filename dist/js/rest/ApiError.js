import { BaseError, wrapErr } from "../errors";
export class ApiError extends BaseError {
    info;
    static wrap(info, err) {
        return new ApiError(info, `wrap with status code ${info.statusCode}`, wrapErr(err));
    }
    constructor(info, message, cause) {
        super("AppError", message, cause);
        this.info = info;
    }
    getInfo() {
        return this.info;
    }
}
