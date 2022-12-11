import { Result, Err, wrapErr } from "./errors";
import { Type } from "io-ts";

export class TypeErr extends Err {
  constructor(message: string, cause?: Err) {
    super("TypeErr", message, {}, cause);
  }
}

export function validateType<T, O = T, I = unknown>(
  type: Type<T, O, I>,
  obj: I
): Result<T, TypeErr> {
  const r = type.decode(obj);
  if (r._tag === "Left")
    return [
      null,
      new TypeErr(
        "invalid type",
        wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)
      ),
    ];
  return [r.right, null];
}
