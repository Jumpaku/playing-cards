import { BaseError } from "./BaseError";

export class IoError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("IoError", message, cause);
  }
}
