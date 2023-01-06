import { CliArgs, parseArgs as parseArgs } from "./parse_args";
import serve from "./cmd/serve";
import show from "./cmd/show";
import { Err, Result } from "../../lib/errors";
import { CliErr } from "./cli_err";

function handleErr(
  args: CliArgs,
  command: string,
  err: Err | null
): Result<void, CliErr> {
  return err != null
    ? [
        null,
        new CliErr(
          `${command} failed`,
          {
            args: args,
            command: `${command}`,
            exitCode: 1,
          },
          err
        ),
      ]
    : [undefined, null];
}

export async function runApp(args: string[]): Promise<Result<void, CliErr>> {
  const parsed = await parseArgs(args);
  const [command] = parsed._;
  switch (command) {
    case "serve": {
      const [, err] = serve(parsed, parsed.config, parsed.dotenv);
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
