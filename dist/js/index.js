import { newEnv } from "./env";
import { panic, InitErr } from "./errors";
import { CryptoIdGen, IncrementIdGen } from "./random/id_gen";
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
    showIds();
    server(ctx, () => { });
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
