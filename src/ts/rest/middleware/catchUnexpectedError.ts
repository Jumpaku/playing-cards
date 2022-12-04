import { NextFunction } from "express";
import { wrapErr } from "../../errors";
import { ApiError } from "../ApiError";
import { Request } from "../Request";
import { Response } from "../Response";
import { status } from "../status";

export default function catchUnexpectedError(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiErr =
    err instanceof ApiError
      ? err
      : new ApiError(
          { statusCode: status.InternalServerError },
          "Unexpected Error",
          wrapErr(err)
        );
  next(apiErr);
}
