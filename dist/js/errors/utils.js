import { exit } from "process";
import { BaseError } from "./BaseError";
import { PanicError } from "./PanicError";
import { UnknownError } from "./UnknownError";
export function panic(message, err) {
    console.error(new PanicError(message, wrapErr(err)).chainMessage());
    exit(1);
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
