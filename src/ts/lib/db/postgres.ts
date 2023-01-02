import { Err, Result, wrapErr } from "../errors";
import { Database, Tx, TxContext } from "./db";
import { DbErr } from "./db_err";
import { Pool, PoolConfig, PoolClient } from "pg";
import { Logger } from "../log/logger";
import { AppContext } from "../../app/context";

class PostgresTx implements Tx {
  constructor(private log: Logger, private client: PoolClient) {}
  async read<
    Row extends {
      [column: string]: unknown;
    }
  >(
    ctx: TxContext,
    statement: string,
    params: unknown[]
  ): Promise<Result<Row[], DbErr>> {
    this.log.info({ logTime: new Date(), name: "db_log" });
    if (ctx.state != "exec") {
      return [
        null,
        new DbErr("transaction already closed", { statement, params }),
      ];
    }
    try {
      const r = await this.client.query<Row>(statement, params);
      return [r.rows, null];
    } catch (err) {
      return [
        null,
        new DbErr("read query failed", { statement, params }, wrapErr(err)),
      ];
    }
  }
  async write(
    ctx: TxContext,
    statement: string,
    params: unknown[]
  ): Promise<Result<void, DbErr>> {
    if (ctx.state != "exec") {
      return [
        null,
        new DbErr("transaction already closed", { statement, params }),
      ];
    }
    try {
      await this.client.query(statement, params);
      return [undefined, null];
    } catch (err) {
      return [
        null,
        new DbErr("write query failed", { statement, params }, wrapErr(err)),
      ];
    }
  }
}

export class Postgres implements Database {
  constructor(config: PoolConfig, private log: Logger) {
    this.pool = new Pool(config);
  }
  private pool: Pool;

  async tx(
    ctx: AppContext,
    exec: (ctx: TxContext, tx: Tx) => Promise<Result<void, Err>>
  ): Promise<Result<void, DbErr>> {
    const client = await this.pool.connect();

    let dbErr: DbErr | null = null;
    try {
      await client.query("BEGIN");
      // read write
      const [, err] = await exec(
        { state: "exec", txId: ctx.idGen.next() },
        new PostgresTx(this.log, client)
      );
      if (err != null) {
        //dbErr = wrap(err);
        await client.query("ROLLBACK");
      } else {
        await client.query("COMMIT");
      }
    } catch (err) {
      //dbErr = wrap(err);
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
    return dbErr == null ? [undefined, null] : [null, dbErr];
  }
}
