import { NextFunction } from "express";
import { wrapErr } from "../../errors";
import { ApiErr } from "../ApiErr";
import { Request } from "../Request";
import { Response } from "../Response";
import { status } from "../status";

export default function catchUnexpectedErr(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiErr =
    err instanceof ApiErr
      ? err
      : new ApiErr(
          "Unexpected Error",
          { statusCode: status.InternalServerError },
          wrapErr(err)
        );
  next(apiErr);
}
