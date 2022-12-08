import { NextFunction } from "express";
import typing from "io-ts";
import { validateType } from "../../lib/typing";
import { ApiErr } from "../api_err";
import { Method, Request, Response, status } from "../utils";

export default function validateJsonBody<JsonBody>(
  method: Method,
  reqType: typing.Type<JsonBody>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== method) {
      return next();
    }
    const [_, typeErr] = validateType(reqType, {
      ...req.body,
      ...req.query,
      ...req.params,
    });
    if (typeErr != null) {
      return next(
        new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr)
      );
    }
    next();
  };
}
