import yargs from "yargs";
export async function parseArgs(args) {
    return yargs
        .scriptName("jumpaku/playing-cards")
        .command("serve [options]", "Start server", (yargs) => yargs.options({
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
    }))
        .command("show <content> <target_command> [options]", "Show variables", (yargs) => yargs
        .positional("content", {
        choices: ["env", "config", "args"],
    })
        .positional("target_command", { choices: ["serve"] }))
        .version(false)
        .parse(args);
}
