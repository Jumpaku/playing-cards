import fp from "fs/promises";
import { stringify } from "../strings";
import { ErrLogInfo } from "./err_log_info";
import { Logger } from "./logger";
import { LogInfo } from "./log_info";

const defaultConsole = console;

export class FileLogger<I extends LogInfo> implements Logger<I> {
  constructor(
    private logDir: string = "log",
    private console: Console = defaultConsole
  ) {}
  info(logInfo: I): void {
    fp.appendFile(
      `${this.logDir}/${logInfo.name}.log`,
      `${stringify(logInfo)}\n`
    );
    this.console.log(stringify(logInfo));
  }
  warn(logInfo: I): void {
    fp.appendFile(
      `${this.logDir}/${logInfo.name}.log`,
      `${stringify(logInfo)}\n`
    );
    this.console.warn(stringify(logInfo));
  }
  error(logInfo: ErrLogInfo): void {
    fp.appendFile(
      `${this.logDir}/${logInfo.name}.log`,
      `${stringify(logInfo)}\n`
    );
    this.console.error(stringify(logInfo));
  }
}
