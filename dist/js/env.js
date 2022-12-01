import dotenv from "dotenv";
import types from "io-ts";
import { wrapErr, IoError } from "./errors";
import { validateType } from "./typing";
export const Env = types.type({
    APP_STAGE: types.string,
    APP_PORT: types.string,
});
export function newEnv(path) {
    const env = dotenv.config({ path });
    if (env.error != null) {
        return [
            null,
            new IoError("fail to load environment variables", wrapErr(env.error)),
        ];
    }
    const [val, err] = validateType(Env, env.parsed);
    if (err != null) {
        Env.name;
        return [null, new IoError(`invalid environment variables`, err)];
    }
    return [val, null];
}
