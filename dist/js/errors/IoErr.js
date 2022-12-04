import { Err } from "./BaseErr";
export class IoErr extends Err {
    constructor(message, cause) {
        super("IoErr", message, {}, cause);
    }
}
