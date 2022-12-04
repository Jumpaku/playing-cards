import { Request as ExpressRequest } from "express";
import { RequestContext } from "./RequestContext";

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
