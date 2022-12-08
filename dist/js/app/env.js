import dotenv from "dotenv";
import types from "io-ts";
import { wrapErr, IoErr } from "../lib/errors";
import { validateType } from "../lib/typing";
export const Env = types.type({
    APP_STAGE: types.string,
    APP_PORT: types.string,
});
export function newEnv(path) {
    const env = dotenv.config({ path });
    if (env.error != null) {
        return [
            null,
            new IoErr("fail to load environment variables", wrapErr(env.error)),
        ];
    }
    const [val, err] = validateType(Env, env.parsed);
    if (err != null) {
        return [null, new IoErr(`invalid environment variables`, err)];
    }
    return [val, null];
}
