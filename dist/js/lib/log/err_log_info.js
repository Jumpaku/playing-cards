import { wrapErr } from "../errors";
export function newErrLogInfo(err) {
    const wrapped = wrapErr(err);
    return {
        name: "error_log",
        logTime: new Date(),
        errName: wrapped.name,
        errMessages: wrapped.chainMessage(),
        errStack: wrapped.stack ?? "",
    };
}
