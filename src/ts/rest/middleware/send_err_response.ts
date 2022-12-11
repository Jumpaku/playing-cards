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
  const info = apiErr.getInfo();
  res.body = {
    name: apiErr.name,
    message: apiErr.message,
    info: info,
  };
  res.status(info.statusCode).json(res.body);
  next();
}
