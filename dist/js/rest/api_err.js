import { Err, wrapErr } from "../lib/errors";
import { status } from "./utils";
export class ApiErr extends Err {
    constructor(message, info, cause) {
        super("ApiErr", message, info, cause);
    }
}
export function wrapApiErr(err) {
    return err instanceof ApiErr
        ? err
        : new ApiErr("Unexpected Error", { statusCode: status.InternalServerError }, wrapErr(err));
}
