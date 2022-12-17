import { Err } from "../lib/errors/base_err";
export class InitErr extends Err {
    constructor(message, cause) {
        super("InitErr", message, {}, cause);
    }
}
