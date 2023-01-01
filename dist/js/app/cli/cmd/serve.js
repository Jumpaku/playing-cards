import { CryptoIdGen } from "../../../lib/id_gen";
import { FileLogger } from "../../../lib/log/file_logger";
import { api_route } from "../../../rest/api/gen/api_route";
import { server } from "../../../rest/server";
import { newEnv } from "../../env";
import { InitErr } from "../../init_err";
export default function serve(args, envFile, configFile) {
    const [env, err] = newEnv(envFile);
    if (err != null) {
        return [null, new InitErr("failed loading env file", err)];
    }
    const ctx = {
        env,
        idGen: new CryptoIdGen(),
        log: new FileLogger(env.LOG_PATH, console),
    };
    server(ctx, (app) => api_route(ctx, app), (server) => {
        process.on("SIGTERM", () => {
            console.log("SIGTERM signal received: closing HTTP server");
            server.close(() => {
                console.log("HTTP server closed");
            });
        });
    });
    return [undefined, null];
}
