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

    class PanicError extends BaseError {
        constructor(message, cause) {
            super("PanicError", message, cause);
        }
    }

    class UnknownError extends BaseError {
        constructor(cause) {
            super("UnknownError", cause != null ? "error is wrapped" : "", cause);
        }
    }

    function panic(cause) {
        if (!(cause instanceof BaseError)) {
            panic(wrapErr(cause));
        }
        console.error(new PanicError("Panic!", cause));
        process.exit(1);
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

    class TypeError extends BaseError {
        constructor(message, cause) {
            super("TypeError", message, cause);
        }
    }

    class IoError extends BaseError {
        constructor(message, cause) {
            super("IoError", message, cause);
        }
    }

    class InitError extends BaseError {
        constructor(message, cause) {
            super("InitError", message, cause);
        }
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

    const Env = types.type({
        APP_STAGE: types.string,
        APP_PORT: types.string,
    });
    function newEnv(path) {
        const env = dotenv.config({ path });
        if (env.error != null) {
            return [
                null,
                new IoError("fail to load environment variables", wrapErr(env.error)),
            ];
        }
        const [val, err] = validateType(Env, env.parsed);
        if (err != null) {
            Env.name;
            return [null, new IoError(`invalid environment variables`, err)];
        }
        return [val, null];
    }

    function server() {
        const app = express();
        const port = 80;
        app.get("/", (req, res) => {
            res.send(req.headers);
        });
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }

    function main() {
        console.log("hello");
        const [env, err] = newEnv(".env");
        if (err != null) {
            panic(new InitError("fail loading env", err));
        }
        console.log(env);
        server();
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
