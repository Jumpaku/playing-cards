import { Err } from "./base_err";
import { panic } from "./utils";
export class BadStateErr extends Err {
    constructor(message, info, cause) {
        super("BadStateErr", message, info, cause);
    }
}
export function check(stateIsValid, message, state) {
    return stateIsValid
        ? null
        : new BadStateErr(message, state == null ? {} : { state });
}
export function panicIfBadState(stateIsValid, message, state) {
    if (!stateIsValid) {
        panic(new BadStateErr(message, state == null ? {} : { state }));
    }
}
