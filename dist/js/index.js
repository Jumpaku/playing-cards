import { newEnv } from "./app/env";
import { panic, InitErr } from "./lib/errors";
import { CryptoIdGen } from "./lib/id_gen";
import { api_route } from "./rest/api/gen/api_route";
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
        idGen: new CryptoIdGen(),
    };
    server(ctx, (app) => {
        api_route(ctx, app);
    });
}
main();
