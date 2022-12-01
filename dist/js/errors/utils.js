import { exit } from "process";
import { BaseError } from "./BaseError";
import { PanicError } from "./PanicError";
import { UnknownError } from "./UnknownError";
export function panic(cause) {
    if (!(cause instanceof BaseError)) {
        panic(wrapErr(cause));
    }
    console.error(new PanicError("Panic!", cause));
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
