import { defaultString } from "../strings";
export function instanceOfErr(obj) {
    return obj instanceof Err;
}
export class Err extends Error {
    info;
    constructor(name, message, info, cause) {
        super(message, { cause });
        this.info = info;
        this.name = name;
        Error.captureStackTrace(this);
    }
    chainMessage() {
        return chainMessageImpl(this).join(" | ");
    }
    print(cerr = console.error.bind(console)) {
        printErrImpl(this, cerr);
    }
    getInfo() {
        return this.info;
    }
}
function chainMessageImpl(err) {
    const cause = err.cause;
    if (cause instanceof Error) {
        return [`${err.name}(${err.message})`, ...chainMessageImpl(cause)];
    }
    return [`${err.name}(${err.message})`, `${defaultString(cause)}`];
}
function printErrImpl(err, cerr) {
    cerr(err);
    if (err.cause == null) {
        return;
    }
    if (!(err.cause instanceof Error)) {
        cerr(err.cause);
        return;
    }
    printErrImpl(err.cause, cerr);
}
