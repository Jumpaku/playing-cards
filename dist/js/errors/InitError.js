import { BaseError } from "./BaseError";
export class InitError extends BaseError {
    constructor(message, cause) {
        super("InitError", message, cause);
    }
}
