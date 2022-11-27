import { BaseError } from "./BaseError";
export class UnknownError extends BaseError {
    static wrap(err) {
        if (err instanceof BaseError) {
            return err;
        }
        if (err instanceof Error) {
            return new UnknownError(err);
        }
        return new UnknownError(new Error(`${err}`, { cause: err }));
    }
    constructor(cause) {
        super("UnknownError", "error is wrapped", cause);
    }
}
