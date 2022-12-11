import { CryptoIdGen, IncrementIdGen } from "./lib/id_gen";
import { newEnv } from "./app/env";
import { panic, InitErr } from "./lib/errors";
import { api_route } from "./rest/api/gen/api_route";
import { server } from "./rest/server";
import { FileLogger } from "./lib/log/file_logger";
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
        log: new FileLogger(env.LOG_PATH, console),
    };
    showIds();
    server(ctx, (app) => {
        api_route(ctx, app);
    });
}
function showIds() {
    const idGen0 = new CryptoIdGen();
    for (let i = 0; i < 10; i++) {
        console.log(idGen0.next());
    }
    const idGen1 = new IncrementIdGen(1);
    for (let i = 0; i < 10; i++) {
        console.log(idGen1.next());
    }
}
main();
