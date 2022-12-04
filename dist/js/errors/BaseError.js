export class BaseError extends Error {
    constructor(name, message, cause) {
        super(message, { cause });
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
        return {};
    }
}
function chainMessageImpl(err) {
    if (err.cause instanceof Error) {
        return [`${err.name}(${err.message})`, ...chainMessageImpl(err.cause)];
    }
    return [`${err.name}(${err.message})`, `${err.cause}`];
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
