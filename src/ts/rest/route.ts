import { Application, NextFunction } from "express";
import { Result } from "../lib/errors";
import { ApiErr } from "./api_err";
import { CallContext } from "./call_context";
import { methods, Request, Response } from "./utils";

export type Handler<Req, Res> = (
  ctx: CallContext,
  req: Req
) => Promise<Result<Res, ApiErr>>;

export function route<Req, Res>(
  app: Application,
  method: typeof methods[number],
  path: string,
  handler: Handler<Req, Res>
) {
  const wrap = async (
    req: Request<Res, Req>,
    res: Response<Res>,
    next: NextFunction
  ) => {
    const args = { ...req.body, ...req.query, ...req.params };
    const [result, apiErr] = await handler(req.ctx!, args);
    if (apiErr != null) {
      return next(apiErr);
    }
    res.body = result;
    next();
  };
  app[method](
    path,
    (req: Request<Res, Req>, res: Response<Res>, next: NextFunction) => {
      wrap(req, res, next).catch(next);
    }
  );
}
