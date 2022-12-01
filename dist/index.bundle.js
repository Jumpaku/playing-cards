(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('dotenv'), require('io-ts'), require('process'), require('express')) :
    typeof define === 'function' && define.amd ? define(['dotenv', 'io-ts', 'process', 'express'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotenv, global.types, global.process, global.express));
})(this, (function (dotenv, types, process, express) { 'use strict';

    class BaseError extends Error {
        constructor(name, message, cause) {
            super(message, { cause: cause });
            this.name = name;
            Error.captureStackTrace(this);
        }
        chainMessage() {
            return chainMessageImpl(this).join(" | ");
        }
        print(cerr = console.error) {
            printErrImpl(this, cerr);
        }
        getInfo() {
            return {};
        }
    }
    function chainMessageImpl(err) {
        if (err.cause instanceof Error) {
            return [`${err.name}(${err.message})`, ...chainMessageImpl(err.cause)];
        }
        return [`${err.name}(${err.message})`, `${err.cause}`];
    }
    function printErrImpl(err, cerr) {
        cerr(err);
        if (err.cause == null) {
            return;
        }
        if (!(err.cause instanceof Error)) {
            cerr(err.cause);
            return;
        }
        printErrImpl(err.cause, cerr);
    }

    class UnknownError extends BaseError {
        constructor(cause) {
            super("UnknownError", cause != null ? "error is wrapped" : "", cause);
        }
    }
    function wrapErr(err) {
        if (err instanceof BaseError) {
            return err;
        }
        if (err instanceof Error) {
            return new UnknownError(err);
        }
        return new UnknownError(new Error(`${err}`, { cause: err }));
    }

    class PanicError extends BaseError {
        constructor(message, cause) {
            super("PanicError", message, cause);
        }
    }
    function panic(message, err) {
        console.error(new PanicError(message, wrapErr(err)).chainMessage());
        process.exit(1);
    }

    function validateType(type, obj) {
        const r = type.decode(obj);
        if (r._tag === "Left")
            return [
                null,
                new TypeError("invalid type", wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)),
            ];
        return [r.right, null];
    }
    class TypeError extends BaseError {
        constructor(message, cause) {
            super("TypeError", message, cause);
        }
    }

    const Env = types.type({
        APP_STAGE: types.string,
        APP_PORT: types.string,
    });
    let env;
    function getEnv() {
        if (env == null) {
            const [val, err] = validateType(Env, dotenv.config().parsed);
            if (err != null) {
                panic("invalid environment variables", err);
            }
            else {
                env = val;
            }
        }
        return env;
    }

    const app = express();
    const port = 80;
    function server() {
        app.get("/", (req, res) => {
            res.send(req.headers);
        });
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }

    function main() {
        console.log("hello");
        console.log(getEnv());
        server();
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
