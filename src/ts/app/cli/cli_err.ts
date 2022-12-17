import { Err, wrapErr } from "../../lib/errors";
import { CliArgs } from "./parse_args";

export type CliErrInfo = {
  command: string;
  args: CliArgs;
  exitCode: number;
};

export class CliErr extends Err<CliErrInfo> {
  constructor(message: string, info: CliErrInfo, cause?: Err) {
    super("CliErr", message, info, cause);
  }
}

export function wrapCliErr(info: CliErrInfo, err: unknown): CliErr {
  return err instanceof CliErr
    ? err
    : new CliErr("error is wrapped", info, wrapErr(err));
}
