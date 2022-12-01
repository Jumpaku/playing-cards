import { BaseError } from "./BaseError";
export class TypeError extends BaseError {
    constructor(message, cause) {
        super("TypeError", message, cause);
    }
}
