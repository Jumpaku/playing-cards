import types from "io-ts";

export const Env = types.type({
  APP_STAGE: types.string,
  APP_PORT: types.string,
  LOG_PATH: types.string,
});

export type Env = types.TypeOf<typeof Env>;
