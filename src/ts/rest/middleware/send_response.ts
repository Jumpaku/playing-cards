import { NextFunction } from "express";
import { Request, Response, status } from "../utils";

export default function sendResponse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(status.Ok).json(res.body ?? {});
  next();
}
