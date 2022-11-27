import dotenv from "dotenv";
import { getEnv } from "./env";
import { server } from "./server";
dotenv.config().parsed;
function main() {
  console.log("hello");
  console.log(getEnv());
  server();
}
main();
