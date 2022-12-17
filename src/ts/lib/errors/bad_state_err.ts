import { Err } from "./base_err";
import { panic } from "./utils";

export type BadStateErrInfo = {
  state?: Record<string, unknown>;
};

export class BadStateErr extends Err<BadStateErrInfo> {
  constructor(message: string, info: BadStateErrInfo, cause?: Err) {
    super("BadStateErr", message, info, cause);
  }
}

export function check(
  stateIsValid: boolean,
  message: string,
  state?: Record<string, unknown>
): BadStateErr | null {
  return stateIsValid
    ? null
    : new BadStateErr(message, state == null ? {} : { state });
}

export function panicIfBadState(
  stateIsValid: boolean,
  message: string,
  state?: Record<string, unknown>
): void | never {
  if (!stateIsValid) {
    panic(new BadStateErr(message, state == null ? {} : { state }));
  }
}
