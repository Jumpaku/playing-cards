import { NextFunction } from "express";
import { wrapErr } from "../../errors";
import { ApiErr } from "../ApiErr";
import { Request } from "../Request";
import { Response } from "../Response";
import { status } from "../status";

export default function catchParseJsonErr(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(
    new ApiErr(
      "cannot parse json",
      { statusCode: status.BadRequest },
      wrapErr(err)
    )
  );
}
