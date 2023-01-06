import { Err, panic, Result, wrapErr } from "../errors";
import { Database, Transaction, TransactionInfo } from "./db";
import { DbErr, wrapDbErr } from "./db_err";
import { Pool, PoolConfig, PoolClient } from "pg";
import { AppContext } from "../../app/context";
import { newDbLog } from "./db_log";
import { combine } from "../errors/multi_err";
import { newErrLogInfo } from "../log/err_log_info";

export class Postgres implements Database {
  constructor(private appCtx: AppContext, config: PoolConfig) {
    this.pool = new Pool(config);
  }
  private pool: Pool;

  async tx(
    exec: (tx: Transaction) => Promise<Result<void, Err>>
  ): Promise<Result<void, DbErr>> {
    let client: PoolClient;
    try {
      client = await this.pool.connect();
    } catch (err) {
      return [null, new DbErr("connection failed", {}, wrapErr(err))];
    }
    const tx = new PostgresTransaction(this.appCtx, client);
    try {
      await tx.begin();
      const [, err] = await exec(tx);
      if (err != null && tx.info.state === "begin") {
        await tx.rollback(err);
      } else {
        await tx.commit();
      }
    } catch (err) {
      panic("await never fails");
    } finally {
      client.release();
    }
    if (tx.info.state === "rollback") {
      this.appCtx.log.info(newErrLogInfo(this.appCtx.clock.now(), tx.info.err));
      return [null, tx.info.err];
    }
    return [undefined, null];
  }
}
class PostgresTransaction implements Transaction {
  constructor(private appCtx: AppContext, private client: PoolClient) {
    this.info = { state: "begin", txId: appCtx.idGen.next() };
  }
  info: TransactionInfo;

  /**
   * This method never rejects
   * @param exec
   * @param statement
   * @param params
   * @returns
   */
  async query<Row extends Record<string, unknown>>(
    query: "read" | "write",
    statement: string,
    params: unknown[]
  ): Promise<Result<Row[], DbErr>> {
    if (this.info.state !== "begin") {
      return [
        null,
        new DbErr("transaction already closed", { statement, params }),
      ];
    }
    try {
      const r = await this.client.query<Row>(statement, params);
      return [r.rows, null];
    } catch (err) {
      const dbErr = new DbErr(
        `${query} query failed`,
        { statement, params },
        wrapErr(err)
      );
      await this.rollback(dbErr);
      return [null, dbErr];
    }
  }

  /**
   * This method never rejects
   * @param statement
   * @param params
   * @returns
   */
  async read<Row extends Record<string, unknown>>(
    statement: string,
    params: unknown[]
  ): Promise<Result<Row[], DbErr>> {
    this.appCtx.log.info(
      newDbLog(
        this.appCtx.clock.now(),
        this.info.txId,
        "write",
        statement,
        params
      )
    );
    return this.query("read", statement, params);
  }

  /**
   * This method never rejects
   * @param statement
   * @param params
   * @returns
   */
  async write(
    statement: string,
    params: unknown[]
  ): Promise<Result<void, DbErr>> {
    this.appCtx.log.info(
      newDbLog(
        this.appCtx.clock.now(),
        this.info.txId,
        "write",
        statement,
        params
      )
    );
    return this.query("write", statement, params).then(([, err]) =>
      err == null ? [undefined, null] : [null, err]
    );
  }
  /**
   * This method never rejects
   * @param err
   */
  async begin(): Promise<void> {
    this.appCtx.log.info(
      newDbLog(this.appCtx.clock.now(), this.info.txId, "begin")
    );
    try {
      await this.client.query("BEGIN");
    } catch (e) {
      return this.rollback(wrapDbErr(e));
    }
    this.info = { txId: this.info.txId, state: "begin" };
  }
  /**
   * This method never rejects
   * @param err
   */
  async rollback(err: unknown): Promise<void> {
    this.appCtx.log.info(
      newDbLog(this.appCtx.clock.now(), this.info.txId, "rollback")
    );
    let dbErr: DbErr;
    try {
      await this.client.query("ROLLBACK");
      dbErr = wrapDbErr(err);
    } catch (e) {
      dbErr = wrapDbErr(combine(e, err));
    }
    this.info = {
      txId: this.info.txId,
      state: "rollback",
      err: dbErr,
    };
  }
  /**
   * This method never rejects
   * @param err
   */
  async commit(): Promise<void> {
    this.appCtx.log.info(
      newDbLog(this.appCtx.clock.now(), this.info.txId, "commit")
    );
    try {
      await this.client.query("COMMIT");
    } catch (e) {
      return this.rollback(wrapDbErr(e));
    }
    this.info = { txId: this.info.txId, state: "commit" };
  }
}
