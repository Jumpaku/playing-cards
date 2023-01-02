import { LogInfo } from "../log/log_info";

export type DbInfo = LogInfo & {
  name: "db_log";
  txId: string;
} & (
    | {
        op: "read";
        statement: string;
        params: unknown[];
      }
    | {
        op: "write";
        statement: string;
        params: unknown[];
      }
    | { op: "begin" }
    | { op: "commit" }
    | {
        op: "rollback";
        message: string;
        info: unknown;
      }
  );
