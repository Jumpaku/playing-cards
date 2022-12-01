import { BaseError } from "./BaseError";
export class UnknownError extends BaseError {
    constructor(cause) {
        super("UnknownError", cause != null ? "error is wrapped" : "", cause);
    }
}
export function wrapErr(err) {
    if (err instanceof BaseError) {
        return err;
    }
    if (err instanceof Error) {
        return new UnknownError(err);
    }
    return new UnknownError(new Error(`${err}`, { cause: err }));
}
