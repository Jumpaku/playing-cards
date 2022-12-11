import { Err } from "../lib/errors";
export class ApiErr extends Err {
    constructor(message, info, cause) {
        super("ApiErr", message, info, cause);
    }
}
