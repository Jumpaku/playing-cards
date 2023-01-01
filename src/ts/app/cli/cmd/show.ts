import { Err, IoErr, Result } from "../../../lib/errors";
import { BadArgsErr } from "../../../lib/errors/bad_args_err";
import { newEnv } from "../../env";
import { CliArgs } from "../parse_args";

export default function show(args: CliArgs): Result<void, Err> {
  switch (args.target_command) {
    case "serve":
      return showServe(args, args.content!, args.env, args.config);
    default:
      return [
        null,
        new BadArgsErr("bad argument", {
          args: { target_command: args.target_command },
        }),
      ];
  }
}

function showServe(
  args: CliArgs,
  content: "env" | "config" | "args",
  envFile: string,
  configFile: string
): Result<void, Err> {
  switch (content) {
    case "env":
      const [env, err] = newEnv(envFile);
      if (err != null) {
        return [null, new IoErr("fail loading env", err)];
      }
      console.log(env);
      return [undefined, null];
    case "config":
      console.log("Nothing to show");
      return [undefined, null];
    case "args":
      console.log({
        target_command: "serve",
        env: envFile,
        config: configFile,
      });
      return [undefined, null];
    default:
      return [
        null,
        new BadArgsErr(`content must be one of "env", "config", or "args"`, {
          args: content,
        }),
      ];
  }
}
