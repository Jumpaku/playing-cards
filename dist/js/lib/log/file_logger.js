import fp from "fs/promises";
import { stringify } from "../strings";
const defaultConsole = console;
export class FileLogger {
    logDir;
    console;
    constructor(logDir = "log", console = defaultConsole) {
        this.logDir = logDir;
        this.console = console;
    }
    info(logInfo) {
        fp.appendFile(`${this.logDir}/${logInfo.name}.log`, `${stringify(logInfo)}\n`);
        this.console.log(stringify(logInfo));
    }
    warn(logInfo) {
        fp.appendFile(`${this.logDir}/${logInfo.name}.log`, `${stringify(logInfo)}\n`);
        this.console.warn(stringify(logInfo));
    }
    error(logInfo) {
        fp.appendFile(`${this.logDir}/${logInfo.name}.log`, `${stringify(logInfo)}\n`);
        this.console.error(stringify(logInfo));
    }
}
