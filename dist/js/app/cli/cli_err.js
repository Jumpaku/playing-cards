import { Err, wrapErr } from "../../lib/errors";
export class CliErr extends Err {
    constructor(message, info, cause) {
        super("CliErr", message, info, cause);
    }
}
export function wrapCliErr(info, err) {
    return err instanceof CliErr
        ? err
        : new CliErr("error is wrapped", info, wrapErr(err));
}
