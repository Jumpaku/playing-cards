import { NextFunction } from "express";
import { wrapApiErr } from "../api_err";
import { Request, Response } from "../utils";

export default function sendErrResponse(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiErr = wrapApiErr(err);
  res.body = apiErr.asResponse();
  res.status(apiErr.getInfo().statusCode).json(res.body);
  next();
}
