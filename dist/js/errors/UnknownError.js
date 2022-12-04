import { BaseError } from "./BaseError";
export class UnknownError extends BaseError {
    constructor(cause) {
        super("UnknownError", cause != null ? "error is wrapped" : "", cause);
    }
}
