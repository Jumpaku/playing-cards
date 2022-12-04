import { NextFunction } from "express";
import { ApiError } from "../ApiError";
import { Request } from "../Request";
import { Response } from "../Response";

export default function sendErrorResponse(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    const info = err.getInfo();
    res.status(info.statusCode).json({
      name: err.name,
      message: err.message,
      info: info,
    });
  }
  next();
}
