import { Type } from "io-ts";
import { BaseError } from "./BaseError";
import { Result } from "./Result";
import { wrapErr } from "./UnknownError";

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

export class TypeError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("TypeError", message, cause);
  }
}
