import { Err } from "./base_err";
export class UnknownErr extends Err {
    constructor(cause) {
        super("UnknownErr", cause != null ? "error is wrapped" : "", {}, cause);
    }
}
