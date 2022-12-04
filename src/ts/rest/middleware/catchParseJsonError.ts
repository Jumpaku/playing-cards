import { NextFunction } from "express";
import { wrapErr } from "../../errors";
import { ApiError } from "../ApiError";
import { Request } from "../Request";
import { Response } from "../Response";
import { status } from "../status";

export default function catchParseJsonError(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(
    new ApiError(
      { statusCode: status.BadRequest },
      "cannot parse json",
      wrapErr(err)
    )
  );
}
