import { runApp } from "./app/cli/run_app";
async function main() {
    const [, err] = await runApp(process.argv.slice(2));
    if (err != null) {
        console.error(err.chainMessage());
        err.print();
        process.exit(err.getInfo().exitCode);
    }
}
main();
