import { Err } from "../errors";
import { Status } from "./utils";
export type ApiErrInfo = {
  statusCode: Status[keyof Status];
};
export class ApiErr extends Err<ApiErrInfo> {
  constructor(message: string, info: ApiErrInfo, cause?: Err) {
    super("AppErr", message, info, cause);
  }
}
