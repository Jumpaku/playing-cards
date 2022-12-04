import { Err } from "./BaseErr";
export class UnknownErr extends Err {
    constructor(cause) {
        super("UnknownErr", cause != null ? "error is wrapped" : "", {}, cause);
    }
}
