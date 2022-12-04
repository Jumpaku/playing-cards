import { Application, NextFunction } from "express";
import { Result } from "../../errors";
import { ApiErr } from "../api_err";
import { RequestContext } from "../request_context";
import { Request as ExpressRequest } from "express";
import { Response as ExpressResponse } from "express";
import { methods } from "../utils";

export type Handler<Req, Res> = (
  ctx: RequestContext,
  req: Req
) => Promise<Result<Res, ApiErr>>;

export interface Request<
  ResBody = Record<string, unknown>,
  ReqBody = Record<string, unknown>
> extends ExpressRequest<
    Record<string, string>,
    ResBody,
    ReqBody,
    qs.ParsedQs,
    Record<string, unknown>
  > {
  ctx?: RequestContext;
}

export interface Response<ResBody = Record<string, unknown>>
  extends ExpressResponse<ResBody, Record<string, unknown>> {
  body?: ResBody;
}

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
