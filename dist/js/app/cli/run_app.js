import { parseArgs as parseArgs } from "./parse_args";
import serve from "./cmd/serve";
import show from "./cmd/show";
import { CliErr } from "./cli_err";
function handleErr(args, command, err) {
    return err != null
        ? [
            null,
            new CliErr(`${command} failed`, {
                args: args,
                command: `${command}`,
                exitCode: 1,
            }, err),
        ]
        : [undefined, null];
}
export async function runApp(args) {
    const parsed = await parseArgs(args);
    const [command] = parsed._;
    switch (command) {
        case "serve": {
            const [, err] = serve(parsed, parsed.env, parsed.config);
            return handleErr(parsed, command, err);
        }
        case "show": {
            const [, err] = show(parsed);
            return handleErr(parsed, command, err);
        }
        default:
            return [
                null,
                new CliErr("bad command", {
                    args: parsed,
                    command: `${command}`,
                    exitCode: 1,
                }),
            ];
    }
}
