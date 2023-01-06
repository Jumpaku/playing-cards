import { Err, wrapErr } from "../lib/errors";
import { status, Status } from "./utils";

export type ApiErrInfo = {
  statusCode: Status[keyof Status];
};
export type ApiErrRes = {
  name: string;
  message: string;
  info: ApiErrInfo;
};
export class ApiErr extends Err<ApiErrInfo> {
  constructor(message: string, info: ApiErrInfo, cause?: Err) {
    super("ApiErr", message, info, cause);
  }
  asResponse(): ApiErrRes {
    return {
      name: this.name,
      message: this.message,
      info: this.getInfo(),
    };
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
