import { assertNonNull } from "../errors";
import { LogInfo } from "../log/log_info";

export type DbLogInfo = LogInfo & {
  name: "db_log";
  txId: string;
} & (
    | { tag: "begin" | "commit" | "rollback" }
    | {
        tag: "read" | "write";
        statement: string;
        params: unknown[];
      }
  );

export function newDbLog(
  logTime: Date,
  txId: string,
  tag: "begin" | "commit" | "rollback"
): DbLogInfo;
export function newDbLog(
  logTime: Date,
  txId: string,
  tag: "read" | "write",
  statement: string,
  params: unknown[]
): DbLogInfo;
export function newDbLog(
  logTime: Date,
  txId: string,
  tag: DbLogInfo["tag"],
  statement?: string,
  params?: unknown[]
): DbLogInfo {
  switch (tag) {
    case "begin":
    case "commit":
    case "rollback":
      return { name: "db_log", logTime, txId, tag };
    case "read":
    case "write":
      assertNonNull(statement);
      assertNonNull(params);
      return {
        name: "db_log",
        logTime,
        txId,
        tag,
        statement: statement,
        params: params,
      };
  }
}
