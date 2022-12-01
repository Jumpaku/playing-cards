import dotenv from "dotenv";
import types from "io-ts";
import { Result, BaseError, wrapErr, IoError } from "./errors";
import { validateType } from "./typing";

export const Env = types.type({
  APP_STAGE: types.string,
  APP_PORT: types.string,
});

export type Env = types.TypeOf<typeof Env>;

export function newEnv(path: string): Result<Env, IoError> {
  const env = dotenv.config({ path });
  if (env.error != null) {
    return [
      null,
      new IoError("fail to load environment variables", wrapErr(env.error)),
    ];
  }
  const [val, err] = validateType(Env, env.parsed);
  if (err != null) {
    return [null, new IoError(`invalid environment variables`, err)];
  }
  return [val, null];
}
