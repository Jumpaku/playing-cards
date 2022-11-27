import { exit } from "process";
import { BaseError } from "./BaseError";
import { UnknownError } from "./UnknownError";

export class PanicError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("PanicError", message, cause);
  }
}

export function panic(message: string, err?: unknown): never {
  console.error(
    new PanicError(
      message,
      err instanceof BaseError ? err : UnknownError.wrap(err)
    ).chainMessage()
  );
  exit(1);
}
