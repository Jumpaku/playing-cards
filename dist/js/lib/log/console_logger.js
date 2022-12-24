import { stringify } from "../strings";
const defaultConsole = console;
export class ConsoleLogger {
    console;
    constructor(console = defaultConsole) {
        this.console = console;
    }
    info(logInfo) {
        this.console.log(stringify(logInfo));
    }
    warn(logInfo) {
        this.console.warn(stringify(logInfo));
    }
    error(logInfo) {
        this.console.error(stringify(logInfo));
    }
}
