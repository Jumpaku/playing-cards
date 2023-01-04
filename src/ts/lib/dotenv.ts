import dotenv from "dotenv";
import types from "io-ts";
import { Result, wrapErr, IoErr } from "./errors";
import { validateType } from "./typing";

export function loadDotenv<EnvType>(
  envType: types.Type<EnvType, EnvType>,
  dotenvPath?: string
): Result<EnvType, IoErr> {
  const loaded = dotenv.config(
    dotenvPath == null ? undefined : { path: dotenvPath }
  );
  if (loaded.error != null) {
    return [
      null,
      new IoErr("fail to load environment variables", wrapErr(loaded.error)),
    ];
  }
  const [val, err] = validateType(envType, loaded.parsed);
  if (err != null) {
    return [null, new IoErr(`invalid environment variables`, err)];
  }
  return [val, null];
}
