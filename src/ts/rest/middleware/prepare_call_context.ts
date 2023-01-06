import { NextFunction } from "express";
import { AppContext } from "../../app/context";
import { Request, Response } from "../utils";

export default function prepareCallContext(appCtx: AppContext) {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.callCtx = {
      callId: appCtx.idGen.next(),
      callTime: new Date(),
      token: "",
    };
    next();
  };
}
