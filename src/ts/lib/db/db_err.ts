import { Err, wrapErr } from "../errors";

export type DbErrInfo =
  | {}
  | {
      statement: string;
      params: unknown[];
    };

export class DbErr extends Err<DbErrInfo> {
  constructor(message: string, info: DbErrInfo, cause?: Err) {
    super("DbErr", message, info, cause);
  }
}

export function wrapDbErr(err: unknown): DbErr {
  return err instanceof DbErr ? err : new DbErr("BD Error", {}, wrapErr(err));
}
