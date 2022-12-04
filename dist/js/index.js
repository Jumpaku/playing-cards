import { newEnv } from "./env";
import { panic, InitErr } from "./errors";
import { server } from "./rest/server";
function main() {
    console.log("hello");
    const [env, err] = newEnv(".env");
    if (err != null) {
        panic(new InitErr("fail loading env", err));
    }
    console.log(env);
    const ctx = {
        env,
    };
    server(ctx, () => { });
}
main();
