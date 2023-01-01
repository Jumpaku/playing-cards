import yargs from "yargs";

export type CliArgs = {
  readonly env: string;
  readonly config: string;
  content: "env" | "config" | "args" | undefined;
  target_command: "serve" | undefined;
  _: (string | number)[];
  $0: string;
};
export async function parseArgs(args: string[]): Promise<CliArgs> {
  return yargs
    .scriptName("jumpaku/playing-cards")
    .command("serve [options]", "Start server", (yargs) =>
      yargs.options({
        env: {
          type: "string",
          default: ".env",
          describe: "Path of dotenv file",
          requiresArg: true,
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
}
