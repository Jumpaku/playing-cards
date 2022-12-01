import { getEnv } from "./env";
import { server } from "./rest/server";
function main() {
    console.log("hello");
    console.log(getEnv());
    server();
}
main();
