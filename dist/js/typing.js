import { TypeError, wrapErr } from "./errors";
export function validateType(type, obj) {
    const r = type.decode(obj);
    if (r._tag === "Left")
        return [
            null,
            new TypeError("invalid type", wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)),
        ];
    return [r.right, null];
}
