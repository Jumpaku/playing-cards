import dotenv from "dotenv";
let env: {
  APP_PORT: string;
};
export function getEnv() {
  if (env == null) {
    dotenv.config().parsed;
  }
  return env;
}
