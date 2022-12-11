import { LogInfo } from "./log_info";

export interface Logger<I extends LogInfo = LogInfo> {
  info(logInfo: I): void;
  warn(logInfo: I): void;
  error(logInfo: I): void;
}
