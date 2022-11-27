import { exit } from "process";
import { BaseError } from "./BaseError";
import { UnknownError } from "./UnknownError";
export class PanicError extends BaseError {
    constructor(message, cause) {
        super("PanicError", message, cause);
    }
}
export function panic(message, err) {
    console.error(new PanicError(message, err instanceof BaseError ? err : UnknownError.wrap(err)).chainMessage());
    exit(1);
}
