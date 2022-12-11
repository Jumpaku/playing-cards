import { stringify } from "../strings";
import { ErrLogInfo } from "./err_log_info";
import { Logger } from "./logger";
import { LogInfo } from "./log_info";

const defaultConsole = console;

export class ConsoleLogger<I extends LogInfo> implements Logger<I> {
  constructor(private console: Console = defaultConsole) {}
  info(logInfo: I): void {
    this.console.log(stringify(logInfo));
  }
  warn(logInfo: I): void {
    this.console.warn(stringify(logInfo));
  }
  error(logInfo: ErrLogInfo): void {
    this.console.error(stringify(logInfo));
  }
}
