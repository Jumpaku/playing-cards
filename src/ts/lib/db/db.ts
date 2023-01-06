import { Err, Result } from "../errors";
import { DbErr } from "./db_err";

export interface Database {
  tx(
    exec: (tx: Transaction) => Promise<Result<void, Err>>
  ): Promise<Result<void, DbErr>>;
}

export type TransactionInfo =
  | {
      txId: string;
      state: "begin" | "commit";
    }
  | {
      txId: string;
      state: "rollback";
      err: DbErr;
    };

export interface Transaction {
  info: TransactionInfo;
  read<Row extends Record<string, unknown>>(
    statement: string,
    params: unknown[]
  ): Promise<Result<Row[], DbErr>>;
  write(statement: string, params: unknown[]): Promise<Result<void, DbErr>>;
}
