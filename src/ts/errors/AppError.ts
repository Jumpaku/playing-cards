import { UnknownError } from "./UnknownError";
import { BaseError } from "./BaseError";

export class AppError extends BaseError {
  public static wrap(statusCode: number, err: unknown): AppError {
    return new AppError(
      statusCode,
      `with status code ${statusCode}`,
      UnknownError.wrap(err)
    );
  }
  constructor(readonly statusCode: number, message: string, cause?: BaseError) {
    super("AppError", message, cause);
  }
}
