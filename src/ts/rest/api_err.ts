import { Err, wrapErr } from "../lib/errors";
import { status, Status } from "./utils";
export type ApiErrInfo = {
  statusCode: Status[keyof Status];
};
export class ApiErr extends Err<ApiErrInfo> {
  constructor(message: string, info: ApiErrInfo, cause?: Err) {
    super("ApiErr", message, info, cause);
  }
}

export function wrapApiErr(err: unknown): ApiErr {
  return err instanceof ApiErr
    ? err
    : new ApiErr(
        "Unexpected Error",
        { statusCode: status.InternalServerError },
        wrapErr(err)
      );
}
