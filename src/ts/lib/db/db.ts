import { AppContext } from "../../app/context";
import { Err, Result } from "../errors";
import { DbErr } from "./db_err";

export type TxContext = {
  txId: string;
  state: "exec" | "rollback" | "commit";
};

export interface Tx {
  read<
    Row extends {
      [column: string]: unknown;
    }
  >(
    ctx: TxContext,
    statement: string,
    params: unknown[]
  ): Promise<Result<Row[], DbErr>>;
  write(
    ctx: TxContext,
    statement: string,
    params: unknown[]
  ): Promise<Result<void, DbErr>>;
}

export interface Database {
  tx(
    ctx: AppContext,
    exec: (ctx: TxContext, tx: Tx) => Promise<Result<void, Err>>
  ): Promise<Result<void, DbErr>>;
}
