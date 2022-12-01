import { Result, TypeError, wrapErr } from "./errors";
import { Type } from "io-ts";
export function validateType<T, O = T, I = unknown>(
  type: Type<T, O, I>,
  obj: I
): Result<T, TypeError> {
  const r = type.decode(obj);
  if (r._tag === "Left")
    return [
      null,
      new TypeError(
        "invalid type",
        wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)
      ),
    ];
  return [r.right, null];
}
