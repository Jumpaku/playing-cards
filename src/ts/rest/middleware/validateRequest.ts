import { NextFunction } from "express";
import typing from "io-ts";
import { validateType } from "../../typing";
import { ApiError } from "../ApiError";
import { Request } from "../Request";
import { Response } from "../Response";
import { status } from "../status";

export default function validateJsonBody<JsonBody>(
  reqType: typing.Type<JsonBody>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    const [_, typeErr] = validateType(reqType, {
      ...req.body,
      ...req.query,
      ...req.params,
    });
    if (typeErr != null) {
      return next(
        new ApiError({ statusCode: status.BadRequest }, "Bad request", typeErr)
      );
    }
    next();
  };
}
