import { wrapErr } from "../errors";
import { LogInfo } from "./log_info";

export type ErrLogInfo = LogInfo & {
  name: "error_log";
  errName: string;
  errMessages: string;
  errStack: string;
};

export function newErrLogInfo(logTime: Date, err: unknown): ErrLogInfo {
  const wrapped = wrapErr(err);
  return {
    name: "error_log",
    logTime: logTime,
    errName: wrapped.name,
    errMessages: wrapped.chainMessage(),
    errStack: wrapped.stack ?? "",
  };
}
