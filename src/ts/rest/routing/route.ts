import { Application, NextFunction } from "express";
import { Result } from "../../errors/Result";
import { ApiError } from "../ApiError";
import { httpMethods } from "../methods";
import { Request } from "../Request";
import { RequestContext } from "../RequestContext";
import { Response } from "../Response";
export type Handler<Req, Res> = (
  ctx: RequestContext,
  treq: Req
) => Promise<Result<Res, ApiError>>;

export function route<Req, Res>(
  app: Application,
  method: typeof httpMethods[number],
  path: string,
  handler: Handler<Req, Res>
) {
  const wrap = async (
    req: Request<Res, Req>,
    res: Response<Res>,
    next: NextFunction
  ) => {
    const args = { ...req.body, ...req.query, ...req.params };
    const [result, apiErr] = await handler(req.ctx as any, args);
    if (apiErr != null) {
      return next(apiErr);
    }
    res.body = result;
  };
  app[method](
    path,
    async (req: Request<Res, Req>, res: Response<Res>, next: NextFunction) => {
      wrap(req, res, next).catch(next);
    }
  );
}
