import dotenv from "dotenv";
import types from "io-ts";
import { panic } from "./errors/panic";
import { validateType } from "./errors/TypeError";

const Env = types.type({
  APP_STAGE: types.string,
  APP_PORT: types.string,
});

export type Env = types.TypeOf<typeof Env>;

let env: Env;
export function getEnv(): Env {
  if (env == null) {
    const [val, err] = validateType(Env, dotenv.config().parsed);
    if (err != null) {
      panic("invalid environment variables", err);
    } else {
      env = val;
    }
  }
  return env;
}
