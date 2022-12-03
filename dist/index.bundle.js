(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('dotenv'), require('io-ts'), require('process'), require('express'), require('body-parser')) :
    typeof define === 'function' && define.amd ? define(['dotenv', 'io-ts', 'process', 'express', 'body-parser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotenv, global.types, global.process, global.express, global.bodyParser));
})(this, (function (dotenv, types, process, express, bodyParser) { 'use strict';

    class BaseError extends Error {
        constructor(name, message, cause) {
            super(message, { cause: cause });
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

    class TypeError extends BaseError {
        constructor(message, cause) {
            super("TypeError", message, cause);
        }
    }

    class UnknownError extends BaseError {
        constructor(cause) {
            super("UnknownError", cause != null ? "error is wrapped" : "", cause);
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
            return [null, new IoError(`invalid environment variables`, err)];
        }
        return [val, null];
    }

    class ApiError extends BaseError {
        info;
        static wrap(info, err) {
            return new ApiError(info, `wrap with status code ${info.statusCode}`, wrapErr(err));
        }
        constructor(info, message, cause) {
            super("AppError", message, cause);
            this.info = info;
        }
        getInfo() {
            return this.info;
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

    function catchParseJsonError(err, req, res, next) {
        next(new ApiError({ statusCode: status.BadRequest }, "cannot parse json", wrapErr(err)));
    }

    function sendResponse(req, res, next) {
        res.status(status.Ok).json(res.body);
        next();
    }

    function sendErrorResponse(err, req, res, next) {
        if (err instanceof ApiError) {
            const info = err.getInfo();
            res.status(info.statusCode).json({
                name: err.name,
                message: err.message,
                info: info,
            });
        }
        next();
    }

    function catchUnexpectedError(err, req, res, next) {
        const apiErr = err instanceof ApiError
            ? err
            : new ApiError({ statusCode: status.InternalServerError }, "Unexpected Error", wrapErr(err));
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
        app.use(catchParseJsonError);
        app.use(newRequestContext);
        routing(app);
        //app.use(path, validateJsonBody(Env));
        //app[method](path, handler(Env));
        app.use(sendResponse);
        app.use(catchUnexpectedError);
        app.use(sendErrorResponse);
        app.listen(ctx.env.APP_PORT, () => {
            console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
        });
    }

    function main() {
        console.log("hello");
        const [env, err] = newEnv(".env");
        if (err != null) {
            panic(new InitError("fail loading env", err));
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
