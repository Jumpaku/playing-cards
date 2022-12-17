import { Err } from "./base_err";
import { panic } from "./utils";
export class BadArgsErr extends Err {
    constructor(message, info, cause) {
        super("BadArgsErr", message, info, cause);
    }
}
export function require(argsIsValid, message, args) {
    return argsIsValid
        ? null
        : new BadArgsErr(message, args == null ? {} : { args });
}
export function panicIfBadArgs(argsIsValid, message, args) {
    if (!argsIsValid) {
        panic(new BadArgsErr(message, args == null ? {} : { args }));
    }
}
