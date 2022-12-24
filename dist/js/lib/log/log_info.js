import { wrapErr } from "../errors";
export function newErrorLogInfo(err) {
    const wrapped = wrapErr(err);
    return {
        name: "error_log",
        logTime: new Date(),
        err_name: wrapped.name,
        err_messages: wrapped.chainMessage(),
        err_stack: wrapped.stack ?? "",
    };
}
