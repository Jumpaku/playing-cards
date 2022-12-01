import { exit } from "process";
import { BaseError } from "./BaseError";
import { wrapErr } from "./UnknownError";

export class PanicError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("PanicError", message, cause);
  }
}

export function panic(message: string, err?: unknown): never {
  console.error(new PanicError(message, wrapErr(err)).chainMessage());
  exit(1);
}
