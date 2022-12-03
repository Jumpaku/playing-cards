import { Response as ExpressResponse } from "express";

export interface Response<ResBody = Record<string, unknown>>
  extends ExpressResponse<ResBody, Record<string, unknown>> {
  body?: ResBody;
}
