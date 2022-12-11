import { exit } from "process";
import { defaultString } from "../strings";
import { Err } from "./base_err";
import { PanicErr } from "./panic_err";
import { UnknownErr } from "./unknown_err";
export function instanceOfErr(obj) {
    return obj instanceof Err;
}
export function panic(cause) {
    if (!(cause instanceof Err)) {
        panic(wrapErr(cause));
    }
    console.error(new PanicErr("Panic!", cause));
    exit(1);
}
export function wrapErr(err) {
    if (instanceOfErr(err)) {
        return err;
    }
    if (err instanceof Error) {
        return new UnknownErr(err);
    }
    return new UnknownErr(new Error(`${defaultString(err)}`, { cause: err }));
}
export function requireNonNull(value, message) {
    if (value == null) {
        panic(message ?? `nonnull value is required`);
    }
}
