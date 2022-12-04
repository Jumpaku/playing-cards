(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('dotenv'), require('io-ts'), require('process'), require('express'), require('body-parser')) :
    typeof define === 'function' && define.amd ? define(['dotenv', 'io-ts', 'process', 'express', 'body-parser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotenv, global.types, global.process, global.express, global.bodyParser));
})(this, (function (dotenv, types, process, express, bodyParser) { 'use strict';

    function defaultString(obj) {
        return obj === null
            ? "null"
            : typeof obj === "undefined"
                ? "undefined"
                : typeof obj === "string"
                    ? obj
                    : typeof obj === "number"
                        ? `${obj}`
                        : typeof obj === "bigint"
                            ? `${obj}`
                            : typeof obj === "boolean"
                                ? `${obj ? "true" : "false"}`
                                : typeof obj === "function"
                                    ? `function ${obj.name === "" ? "<anonymous>" : obj.name}`
                                    : `object ${obj.toString()}`;
    }

    function instanceOfErr(obj) {
        return obj instanceof Err;
    }
    class Err extends Error {
        info;
        constructor(name, message, info, cause) {
            super(message, { cause });
            this.info = info;
            this.name = name;
            Error.captureStackTrace(this);
        }
        chainMessage() {
            return chainMessageImpl(this).join(" | ");
        }
        print(cerr = console.error.bind(console)) {
            printErrImpl(this, cerr);
        }
        getInfo() {
            return this.info;
        }
    }
    function chainMessageImpl(err) {
        const cause = err.cause;
        if (cause instanceof Error) {
            return [`${err.name}(${err.message})`, ...chainMessageImpl(cause)];
        }
        return [`${err.name}(${err.message})`, `${defaultString(cause)}`];
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

    class PanicErr extends Err {
        constructor(message, cause) {
            super("PanicErr", message, {}, cause);
        }
    }

    class UnknownErr extends Err {
        constructor(cause) {
            super("UnknownErr", cause != null ? "error is wrapped" : "", {}, cause);
        }
    }

    class IoErr extends Err {
        constructor(message, cause) {
            super("IoErr", message, {}, cause);
        }
    }

    class InitErr extends Err {
        constructor(message, cause) {
            super("InitErr", message, {}, cause);
        }
    }

    function panic(cause) {
        if (!(cause instanceof Err)) {
            panic(wrapErr(cause));
        }
        console.error(new PanicErr("Panic!", cause));
        process.exit(1);
    }
    function wrapErr(err) {
        if (instanceOfErr(err)) {
            return err;
        }
        if (err instanceof Error) {
            return new UnknownErr(err);
        }
        return new UnknownErr(new Error(`${defaultString(err)}`, { cause: err }));
    }

    class TypeErr extends Err {
        constructor(message, cause) {
            super("TypeErr", message, {}, cause);
        }
    }
    function validateType(type, obj) {
        const r = type.decode(obj);
        if (r._tag === "Left")
            return [
                null,
                new TypeErr("invalid type", wrapErr(`[${r.left.map((e) => e.value).join(",")}]`)),
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
                new IoErr("fail to load environment variables", wrapErr(env.error)),
            ];
        }
        const [val, err] = validateType(Env, env.parsed);
        if (err != null) {
            return [null, new IoErr(`invalid environment variables`, err)];
        }
        return [val, null];
    }

    class ApiErr extends Err {
        constructor(message, info, cause) {
            super("AppErr", message, info, cause);
        }
    }

    const status = {
        // 1XX
        Continue: 100,
        SwitchingProtocols: 101,
        EarlyHints: 102,
        // 2XX
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        // 3XX
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        // 4XX
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        RequestTooLarge: 413,
        RequestUriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        // 5XX
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        NetworkAuthenticationRequired: 511,
    };

    function catchParseJsonErr(err, req, res, next) {
        next(new ApiErr("cannot parse json", { statusCode: status.BadRequest }, wrapErr(err)));
    }

    function sendResponse(req, res, next) {
        res.status(status.Ok).json(res.body);
        next();
    }

    function sendErrResponse(err, req, res, next) {
        if (err instanceof ApiErr) {
            const info = err.getInfo();
            res.status(info.statusCode).json({
                name: err.name,
                message: err.message,
                info: info,
            });
        }
        next();
    }

    function catchUnexpectedErr(err, req, res, next) {
        const apiErr = err instanceof ApiErr
            ? err
            : new ApiErr("Unexpected Error", { statusCode: status.InternalServerError }, wrapErr(err));
        next(apiErr);
    }

    function newRequestContext(app) {
        return (req, res, next) => {
            req.ctx = {
                app: app,
                token: "",
                timestamp: new Date(Date.now()),
            };
            next();
        };
    }

    function server(ctx, routing) {
        const app = express();
        app.use(bodyParser.json({ strict: true, inflate: false }));
        app.use(catchParseJsonErr);
        app.use(newRequestContext);
        routing(app);
        /*
         * App.use(path, validateJsonBody(Env));
         * app[method](path, handler(Env));
         */
        app.use(sendResponse);
        app.use(catchUnexpectedErr);
        app.use(sendErrResponse);
        app.listen(ctx.env.APP_PORT, () => {
            console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
        });
    }

    function main() {
        console.log("hello");
        const [env, err] = newEnv(".env");
        if (err != null) {
            panic(new InitErr("fail loading env", err));
        }
        console.log(env);
        const ctx = {
            env,
        };
        server(ctx, () => { });
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
