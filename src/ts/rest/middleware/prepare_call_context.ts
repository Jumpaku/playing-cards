import { NextFunction } from "express";
import { AppContext } from "../../app/context";
import { Request, Response } from "../utils";

export default function prepareCallContext(app: AppContext) {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.ctx = {
      app: app,
      callId: app.idGen.next(),
      token: "",
      timestamp: new Date(Date.now()),
    };
    next();
  };
}
