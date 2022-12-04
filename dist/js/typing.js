import { BaseError, wrapErr } from "./errors";
export class TypeError extends BaseError {
    constructor(message, cause) {
        super("TypeError", message, cause);
    }
}
export function validateType(type, obj) {
    const r = type.decode(obj);
    if (r._tag === "Left")
        return [
            null,
            new TypeError("invalid type", wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)),
        ];
    return [r.right, null];
}
