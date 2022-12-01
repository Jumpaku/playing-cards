import { Application, Request, Response, NextFunction } from "express";
import { ApiError } from "../../errors/ApiError";
import { Result } from "../../errors/Result";
import typing from "io-ts";
import { validateType } from "../../errors/TypeError";
export type Handler<Req, Res> = (req: Req) => Promise<Result<Res, ApiError>>;

const httpMethods = [
  "get",
  "head",
  "post",
  "put",
  "delete",
  "connect",
  "options",
  "trace",
  "patch",
] as const;
export function route<Req, Res>(
  app: Application,
  method: typeof httpMethods[number],
  path: string,
  reqType: typing.Type<Req>,
  handler: Handler<Req, Res>
) {
  const wrap = async (req: Request, res: Response, next: NextFunction) => {
    const [args, typeErr] = validateType(reqType, {
      ...req.body,
      ...req.query,
      ...req.params,
    });
    if (typeErr != null) {
      return next(new ApiError(400, "Bad request", typeErr));
    }
    const [result, apiErr] = await handler(args);
    if (apiErr != null) {
      return next(apiErr);
    }
    res.send(result);
  };
  app[method](path, async (req, res, next) => wrap(req, res, next).catch(next));
}
