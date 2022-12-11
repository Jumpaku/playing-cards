import { NextFunction } from "express";
import { wrapErr } from "../../lib/errors";
import { ApiErr } from "../api_err";
import { Request, Response, status } from "../utils";

export default function parseJsonBody(
  req: Request<unknown, string>,
  res: Response,
  next: NextFunction
) {
  try {
    const raw = req.rawBody ?? "";
    req.body = raw === "" ? {} : JSON.parse(raw);
    next();
  } catch (err) {
    next(
      new ApiErr(
        "Cannot parse body as JSON",
        { statusCode: status.BadRequest },
        wrapErr(err)
      )
    );
  }
}
