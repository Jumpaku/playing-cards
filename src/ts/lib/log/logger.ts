import { ErrLogInfo } from "./err_log_info";
import { LogInfo } from "./log_info";

export interface Logger<I extends LogInfo = LogInfo> {
  /**
   * Logs information of application behavior
   * @param logInfo
   */
  info(logInfo: I): void;
  /**
   * Logs information that may cause problems and should be fixed in the future
   * @param logInfo
   */
  warn(logInfo: I): void;
  /**
   * Logs information of error that must be fixed immediately or is unrecoverable
   * @param logInfo
   */
  error(logInfo: ErrLogInfo): void;
}
