export class BaseError extends Error {
    constructor(name, message, cause) {
        super(message, { cause: cause });
        this.name = name;
        Error.captureStackTrace(this);
    }
    chainMessage() {
        return chainMessage(this);
    }
}
export function chainMessage(err) {
    const cause = err.cause;
    if (cause instanceof Error) {
        return `${err.name}(${err.message}) : ${chainMessage(cause)}`;
    }
    return `${err.name}(${err.message}) : ${cause}`;
}
