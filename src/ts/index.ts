import { newEnv } from "./env";
import { panic, InitError } from "./errors";
import { server } from "./rest/server";
function main() {
  console.log("hello");
  const [env, err] = newEnv(".env");
  if (err != null) {
    panic(new InitError("fail loading env", err));
  }
  console.log(env);
  server();
}
main();
