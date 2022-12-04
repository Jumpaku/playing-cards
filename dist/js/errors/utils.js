import { exit } from "process";
import { defaultString } from "../strings";
import { Err, instanceOfErr } from "./BaseErr";
import { PanicErr } from "./PanicErr";
import { UnknownErr } from "./UnknownErr";
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
