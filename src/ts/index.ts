import dotenv from "dotenv";
import { server } from "./server";
dotenv.config().parsed;
function main() {
  console.log("hello");
  server();
}
main();
