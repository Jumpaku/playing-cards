import { BaseError } from "./BaseError";

export class InitError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("InitError", message, cause);
  }
}
