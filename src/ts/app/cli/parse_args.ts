import yargs from "yargs";

export type CliArgs = {
  readonly dotenv: string | undefined;
  readonly config: string;
  content: "env" | "config" | "args" | undefined;
  target_command: "serve" | undefined;
  _: (string | number)[];
  $0: string;
};
export async function parseArgs(args: string[]): Promise<CliArgs> {
  const parsed = yargs
    .scriptName("jumpaku/playing-cards")
    .command("serve [options]", "Start server", (yargs) =>
      yargs.options({
        dotenv: {
          type: "string",
          describe: "Path of dotenv file",
          requiresArg: false,
        },
        config: {
          type: "string",
          default: "config.yml",
          describe: "Path of configuration yml file",
          requiresArg: true,
        },
      } as const)
    )
    .command(
      "show <content> <target_command> [options]",
      "Show variables",
      (yargs) =>
        yargs
          .positional("content", {
            choices: ["env", "config", "args"],
          } as const)
          .positional("target_command", { choices: ["serve"] } as const)
    )
    .version(false)
    .parse(args);
  return parsed;
}
