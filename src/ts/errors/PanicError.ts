import { BaseError } from "./BaseError";

export class PanicError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("PanicError", message, cause);
  }
}
