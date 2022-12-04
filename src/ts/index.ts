import { AppContext } from "./context";
import { newEnv } from "./env";
import { panic, InitErr } from "./errors";
import { CryptoIdGen } from "./random/id_gen";
import { server } from "./rest/server";
function main() {
  console.log("hello");
  const [env, err] = newEnv(".env");
  if (err != null) {
    panic(new InitErr("fail loading env", err));
  }
  console.log(env);
  const ctx: AppContext = {
    env,
    idGen: new CryptoIdGen(),
  };
  server(ctx, () => {});
}
main();
