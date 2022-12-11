import { NextFunction } from "express";
import { wrapErr } from "../../errors";
import { ApiErr } from "../api_err";
import { Request, Response, status } from "../utils";

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
