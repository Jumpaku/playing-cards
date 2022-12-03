import { BaseError, wrapErr } from "../errors";
import { status } from "./status";

export type ApiErrorInfo = { statusCode: typeof status[keyof typeof status] };
export class ApiError extends BaseError {
  public static wrap(info: ApiErrorInfo, err: unknown): ApiError {
    return new ApiError(
      info,
      `wrap with status code ${info.statusCode}`,
      wrapErr(err)
    );
  }
  constructor(
    private readonly info: ApiErrorInfo,
    message: string,
    cause?: BaseError
  ) {
    super("AppError", message, cause);
  }
  override getInfo(): ApiErrorInfo {
    return this.info;
  }
}
