import { BaseError } from "./BaseError";
export class IoError extends BaseError {
    constructor(message, cause) {
        super("IoError", message, cause);
    }
}
