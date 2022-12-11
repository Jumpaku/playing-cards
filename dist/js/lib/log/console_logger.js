import { stringify } from "../strings";
export class ConsoleLogger {
    info(logInfo) {
        console.log(stringify(logInfo));
    }
    warn(logInfo) {
        console.error(stringify(logInfo));
    }
    error(logInfo) {
        console.error(stringify(logInfo));
    }
}
