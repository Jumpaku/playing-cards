import { BaseError } from "./BaseError";

export class TypeError extends BaseError {
  constructor(message: string, cause?: BaseError) {
    super("TypeError", message, cause);
  }
}
