import dotenv from "dotenv";
let env;
export function getEnv() {
    if (env == null) {
        dotenv.config().parsed;
    }
    return env;
}
