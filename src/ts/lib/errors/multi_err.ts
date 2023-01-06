import { Err } from "./base_err";
import { wrapErr } from "./utils";

export type MultiErrInfo = { errors: Err[] };
export class MultiErr extends Err<MultiErrInfo> {
  constructor(errors: Err[]) {
    super(
      "MultiErr",
      `error messages: [${errors.map((e) => e.chainMessage()).join(", ")}]`,
      { errors }
    );
  }
}

export function combine(err: unknown, ...errs: unknown[]): Err {
  const errList = [err, ...errs].filter((e) => e != null);
  if (errList.length === 1) {
    return wrapErr(errList[0]);
  }
  return new MultiErr(errList.map((e) => wrapErr(e)));
}
