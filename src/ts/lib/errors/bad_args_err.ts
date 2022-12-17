import { Err } from "./base_err";
import { panic } from "./utils";

export type BadArgsErrInfo = {
  args?: Record<string, unknown>;
};

export class BadArgsErr extends Err<BadArgsErrInfo> {
  constructor(message: string, info: BadArgsErrInfo, cause?: Err) {
    super("BadArgsErr", message, info, cause);
  }
}

export function require(
  argsIsValid: boolean,
  message: string,
  args?: Record<string, unknown>
): BadArgsErr | null {
  return argsIsValid
    ? null
    : new BadArgsErr(message, args == null ? {} : { args });
}

export function panicIfBadArgs(
  argsIsValid: boolean,
  message: string,
  args?: Record<string, unknown>
): void | never {
  if (!argsIsValid) {
    panic(new BadArgsErr(message, args == null ? {} : { args }));
  }
}
