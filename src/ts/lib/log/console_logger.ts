import { stringify } from "../strings";
import { Logger } from "./logger";
import { LogInfo } from "./log_info";

export class ConsoleLogger<I extends LogInfo> implements Logger<I> {
  info(logInfo: I): void {
    console.log(stringify(logInfo));
  }
  warn(logInfo: I): void {
    console.error(stringify(logInfo));
  }
  error(logInfo: I): void {
    console.error(stringify(logInfo));
  }
}
