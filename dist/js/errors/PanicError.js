import { BaseError } from "./BaseError";
export class PanicError extends BaseError {
    constructor(message, cause) {
        super("PanicError", message, cause);
    }
}
