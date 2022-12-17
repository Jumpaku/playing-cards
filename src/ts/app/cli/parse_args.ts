import yargs from "yargs";

type TypeWithGeneric<T> = Promise<T>;
type ExtractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never;

export type CliArgs = ExtractGeneric<ReturnType<typeof parseArgs>>;
export async function parseArgs(args: string[]) {
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
