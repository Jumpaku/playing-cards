import { Err } from "./BaseErr";
export class InitErr extends Err {
    constructor(message, cause) {
        super("InitErr", message, {}, cause);
    }
}
