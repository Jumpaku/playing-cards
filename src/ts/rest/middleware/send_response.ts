import { NextFunction } from "express";
import { Request } from "../Request";
import { Response } from "../Response";
import { status } from "../status";

export default function sendResponse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(status.Ok).json(res.body);
  next();
}
