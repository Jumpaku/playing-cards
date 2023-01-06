import { NextFunction } from "express";
import { Request, Response } from "../utils";

export default function endCall(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.end();
}
