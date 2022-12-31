import { wrapErr } from "../errors";
import { LogInfo } from "./log_info";

export type ErrLogInfo = LogInfo & {
  name: "error_log";
  err_name: string;
  err_messages: string;
  err_stack: string;
};

export function newErrLogInfo(err: unknown): ErrLogInfo {
  const wrapped = wrapErr(err);
  return {
    name: "error_log",
    logTime: new Date(),
    err_name: wrapped.name,
    err_messages: wrapped.chainMessage(),
    err_stack: wrapped.stack ?? "",
  };
}