(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('dotenv'), require('io-ts'), require('process'), require('crypto'), require('body-parser'), require('express')) :
    typeof define === 'function' && define.amd ? define(['dotenv', 'io-ts', 'process', 'crypto', 'body-parser', 'express'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotenv, global.typing, global.process, global.crypto, global.bodyParser, global.express));
})(this, (function (dotenv, typing, process, crypto, bodyParser, express) { 'use strict';

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

    function instanceOfErr(obj) {
        return obj instanceof Err;
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
    function requireNonNull(value, message) {
        if (value == null) {
            panic(message ?? `nonnull value is required`);
        }
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

    const Env = typing.type({
        APP_STAGE: typing.string,
        APP_PORT: typing.string,
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

    class CryptoIdGen {
        current;
        constructor(current = crypto.randomUUID()) {
            this.current = current;
        }
        value() {
            return this.current;
        }
        next() {
            const v = this.value();
            this.current = crypto.randomUUID();
            return v;
        }
    }

    class ApiErr extends Err {
        constructor(message, info, cause) {
            super("ApiErr", message, info, cause);
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

    function logRequest(cout = console.log.bind(console)) {
        return (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const reqInfo = {
                name: "request_log",
                timestamp: new Date(Date.now()),
                callId: callCtx.callId,
                method: req.method.toLowerCase(),
                url: req.url,
                headers: req.headers,
                body: req.body,
                params: req.params,
                query: req.query,
            };
            cout(JSON.stringify(reqInfo));
            next();
        };
    }

    function catchUnexpectedErr(err, req, res, next) {
        const apiErr = err instanceof ApiErr
            ? err
            : new ApiErr("Unexpected Error", { statusCode: status.InternalServerError }, wrapErr(err));
        next(apiErr);
    }

    function logApiErr(cout = console.log.bind(console), cerr = console.error.bind(console)) {
        return (err, req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const resInfo = {
                name: "api_err_log",
                timestamp: new Date(Date.now()),
                callId: callCtx.callId,
                info: err.getInfo(),
                message: err.chainMessage(),
            };
            cout(JSON.stringify(resInfo));
            err.print(cerr);
            next(err);
        };
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

    function logResponse(cout = console.log.bind(console)) {
        return (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const resInfo = {
                name: "response_log",
                timestamp: new Date(Date.now()),
                callId: callCtx.callId,
                status: res.statusCode,
                headers: res.getHeaders(),
                body: res.body,
            };
            cout(JSON.stringify(resInfo));
            next();
        };
    }

    function endCall(req, res, next) {
        res.end();
    }

    function sendResponse(req, res, next) {
        res.status(status.Ok).json(res.body ?? {});
        next();
    }

    function route(ctx, app, method, path, reqType, handler) {
        const wrappedHandler = async (req, res, next) => {
            return (async () => {
                const args = { ...req.body, ...req.query, ...req.params };
                const [_, typeErr] = validateType(reqType, args);
                if (typeErr != null) {
                    return next(new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr));
                }
                const [result, apiErr] = await handler(req.ctx, args);
                if (apiErr != null) {
                    return next(apiErr);
                }
                res.body = result;
                next();
            })().catch(next);
        };
        app[method](path, [
            bodyParser.json({ strict: true, inflate: false }),
            catchParseJsonErr,
            logRequest(),
            wrappedHandler,
            sendResponse,
            catchUnexpectedErr,
            logApiErr(),
            sendErrResponse,
            logResponse(),
            endCall,
        ]);
    }

    const examples = new Map();

    const Req$4 = typing.type({});
    typing.type({
        list: typing.array(typing.type({
            example_id: typing.string,
            value: typing.type({
                str: typing.string,
                num: typing.number,
            }),
            create_time: typing.string,
            update_time: typing.string,
        })),
    });
    const handler$4 = async (ctx, req) => {
        return [
            {
                list: [...examples.entries()].map(([k, v]) => ({
                    example_id: k,
                    value: { str: v.value_str, num: v.value_num },
                    create_time: v.createTime.toISOString(),
                    update_time: v.updateTime.toISOString(),
                })),
            },
            null,
        ];
    };

    const Req$3 = typing.type({
        value: typing.type({
            str: typing.string,
            num: typing.number,
        }),
    });
    typing.type({
        example_id: typing.string,
    });
    const handler$3 = async (ctx, req) => {
        const example = {
            value_str: req.value.str,
            value_num: req.value.num,
            createTime: ctx.timestamp,
            updateTime: ctx.timestamp,
        };
        const exampleId = ctx.app.idGen.next();
        examples.set(exampleId, example);
        return [{ example_id: exampleId }, null];
    };

    const Req$2 = typing.type({
        example_id: typing.string,
    });
    typing.type({
        example_id: typing.string,
        value: typing.type({
            str: typing.string,
            num: typing.number,
        }),
        create_time: typing.string,
        update_time: typing.string,
    });
    const handler$2 = async (ctx, req) => {
        const e = examples.get(req.example_id);
        if (e == null) {
            return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
        }
        return [
            {
                example_id: req.example_id,
                value: {
                    str: e.value_str,
                    num: e.value_num,
                },
                create_time: e.createTime.toISOString(),
                update_time: e.updateTime.toISOString(),
            },
            null,
        ];
    };

    const Req$1 = typing.type({
        example_id: typing.string,
        value: typing.union([
            typing.undefined,
            typing.type({
                str: typing.union([typing.string, typing.undefined]),
                num: typing.union([typing.number, typing.undefined]),
            }),
        ]),
    });
    typing.type({});
    const handler$1 = async (ctx, req) => {
        const oldExample = examples.get(req.example_id);
        if (oldExample == null) {
            return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
        }
        const newExample = { ...oldExample };
        if (req.value == null) {
            return [{}, null];
        }
        if (req.value.str != null) {
            newExample.value_str = req.value.str;
        }
        if (req.value.num != null) {
            newExample.value_num = req.value.num;
        }
        newExample.updateTime = ctx.timestamp;
        examples.set(req.example_id, newExample);
        return [{}, null];
    };

    const Req = typing.type({
        example_id: typing.string,
    });
    typing.type({});
    const handler = async (ctx, req) => {
        const oldExample = examples.get(req.example_id);
        if (oldExample == null) {
            return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
        }
        examples.delete(req.example_id);
        return [{}, null];
    };

    function api_route(ctx, router) {
        route(ctx, router, "get", "/example", Req$4, handler$4);
        route(ctx, router, "post", "/example", Req$3, handler$3);
        route(ctx, router, "get", "/example/:example_id", Req$2, handler$2);
        route(ctx, router, "put", "/example/:example_id", Req$1, handler$1);
        route(ctx, router, "delete", "/example/:example_id", Req, handler);
        return router;
    }

    function prepareCallContext(app) {
        return (req, res, next) => {
            req.ctx = {
                app: app,
                callId: app.idGen.next(),
                token: "",
                timestamp: new Date(Date.now()),
            };
            next();
        };
    }

    function server(ctx, routing) {
        const router = express.Router();
        router.use(prepareCallContext(ctx));
        routing(router);
        routeDefault(router);
        const app = express();
        app.use(router);
        app.listen(ctx.env.APP_PORT, () => {
            console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
        });
    }
    function routeDefault(router) {
        router.use(bodyParser.text({ defaultCharset: "utf8" }));
        router.use(logRequest());
        router.use((req, res, next) => {
            next(new ApiErr("API not found", { statusCode: status.NotFound }));
        });
        router.use(catchUnexpectedErr);
        router.use(logApiErr());
        router.use(sendErrResponse);
        router.use(logResponse());
        return router;
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
            idGen: new CryptoIdGen(),
        };
        server(ctx, (app) => {
            api_route(ctx, app);
        });
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
