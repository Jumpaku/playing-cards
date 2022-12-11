import { exit } from "process";
import { defaultString } from "../strings";
import { Err } from "./base_err";
import { PanicErr } from "./panic_err";
import { UnknownErr } from "./unknown_err";

export type Result<V, E extends Err> = [V, null] | [null, E];

export function instanceOfErr(obj: unknown): obj is Err {
  return obj instanceof Err;
}

export function panic(cause: Err | unknown): never {
  if (!(cause instanceof Err)) {
    panic(wrapErr(cause));
  }
  console.error(new PanicErr("Panic!", cause));
  exit(1);
}

export function wrapErr(err: unknown): Err {
  if (instanceOfErr(err)) {
    return err;
  }
  if (err instanceof Error) {
    return new UnknownErr(err);
  }
  return new UnknownErr(new Error(`${defaultString(err)}`, { cause: err }));
}
export function requireNonNull(
  value: unknown,
  message?: string
): asserts value is NonNullable<unknown> {
  if (value == null) {
    panic(message ?? `nonnull value is required`);
  }
}
