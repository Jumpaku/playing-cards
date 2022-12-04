import { NextFunction } from "express";
import { AppContext } from "../../context";
import { Request, Response } from "../utils";

export default function newRequestContext(
  app: AppContext
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.ctx = {
      app: app,
      token: "",
      timestamp: new Date(Date.now()),
    };
    next();
  };
}
