import { LogInfo } from "../log/log_info";
import { DbErr } from "./db_err";

export type DbErrLogInfo = LogInfo & {
  name: "db_err_log";
  txId: string;
  errMessage: string;
  errInfo: unknown;
};

export function newDbErrLog(
  logTime: Date,
  txId: string,
  err: DbErr
): DbErrLogInfo {
  return {
    name: "db_err_log",
    txId,
    logTime,
    errMessage: err.chainMessage(),
    errInfo: err.getInfo(),
  };
}
