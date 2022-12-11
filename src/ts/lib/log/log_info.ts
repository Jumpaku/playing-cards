import { wrapErr } from "../errors";

export type LogInfo = {
  name: string;
  timestamp: Date;
};

export type ErrLogInfo = LogInfo & {
  name: "error_log";
  err_name: string;
  err_messages: string;
  err_stack: string;
};

export function newErrorLogInfo(err: unknown): ErrLogInfo {
  const wrapped = wrapErr(err);
  return {
    name: "error_log",
    timestamp: new Date(),
    err_name: wrapped.name,
    err_messages: wrapped.chainMessage(),
    err_stack: wrapped.stack ?? "",
  };
}
