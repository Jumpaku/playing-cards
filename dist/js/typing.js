import { Err, wrapErr } from "./errors";
export class TypeErr extends Err {
    constructor(message, cause) {
        super("TypeErr", message, {}, cause);
    }
}
export function validateType(type, obj) {
    const r = type.decode(obj);
    if (r._tag === "Left")
        return [
            null,
            new TypeErr("invalid type", wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)),
        ];
    return [r.right, null];
}
