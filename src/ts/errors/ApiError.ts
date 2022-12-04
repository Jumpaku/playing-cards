import { BaseError } from "./BaseError";
import { wrapErr } from "./utils";

export class ApiError extends BaseError {
  public static wrap(statusCode: number, err: unknown): ApiError {
    return new ApiError(
      statusCode,
      `wrap with status code ${statusCode}`,
      wrapErr(err)
    );
  }
  constructor(
    private readonly statusCode: number,
    message: string,
    cause?: BaseError
  ) {
    super("AppError", message, cause);
  }
  override getInfo(): { statusCode: number } {
    return { statusCode: this.statusCode };
  }
}
