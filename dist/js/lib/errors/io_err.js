import { Err } from "./base_err";
export class IoErr extends Err {
    constructor(message, cause) {
        super("IoErr", message, {}, cause);
    }
}
