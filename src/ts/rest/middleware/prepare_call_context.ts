import { NextFunction } from "express";
import { AppContext } from "../../app/context";
import { Request, Response } from "../utils";

export default function prepareCallContext(
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
