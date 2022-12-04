import { NextFunction } from "express";
import { ApiErr } from "../ApiErr";
import { Request } from "../Request";
import { Response } from "../Response";

export default function sendErrResponse(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiErr) {
    const info = err.getInfo();
    res.status(info.statusCode).json({
      name: err.name,
      message: err.message,
      info: info,
    });
  }
  next();
}
