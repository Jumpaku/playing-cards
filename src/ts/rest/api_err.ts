import { Err } from "../errors";

export type ApiErrInfo = {
  statusCode: number;
};
export class ApiErr extends Err<ApiErrInfo> {
  constructor(message: string, info: ApiErrInfo, cause?: Err) {
    super("AppErr", message, info, cause);
  }
}
