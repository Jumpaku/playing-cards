import dotenv from "dotenv";
import types from "io-ts";
import { panic } from "./errors";
import { validateType } from "./errors";
const Env = types.type({
    APP_STAGE: types.string,
    APP_PORT: types.string,
});
let env;
export function getEnv() {
    if (env == null) {
        const [val, err] = validateType(Env, dotenv.config().parsed);
        if (err != null) {
            panic("invalid environment variables", err);
        }
        else {
            env = val;
        }
    }
    return env;
}
