import { Err } from "./base_err";
export class PanicErr extends Err {
    constructor(message, cause) {
        super("PanicErr", message, {}, cause);
    }
}
