import { Err } from "./BaseErr";
export class PanicErr extends Err {
    constructor(message, cause) {
        super("PanicErr", message, {}, cause);
    }
}
