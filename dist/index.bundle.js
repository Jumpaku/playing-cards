(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('crypto'), require('dotenv'), require('io-ts'), require('process'), require('express')) :
    typeof define === 'function' && define.amd ? define(['crypto', 'dotenv', 'io-ts', 'process', 'express'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.crypto, global.dotenv, global.typing, global.process, global.express));
})(this, (function (crypto, dotenv, typing, process, express) { 'use strict';

    class IncrementIdGen {
        current;
        constructor(current) {
            this.current = current;
        }
        value() {
            return `id-${this.current}`;
        }
        next() {
            const v = this.value();
            this.current++;
            return v;
        }
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

    function defaultString(obj) {
        return stringify(obj);
    }
    function stringify(value, visited = new Set()) {
        switch (typeof value) {
            case "bigint":
                return `"${value.toString(10)}"`;
            case "boolean":
                return value ? "true" : "false";
            case "number":
                return value.toString(10);
            case "string":
                return `"${value}"`;
            case "undefined":
                return `"<undefined>"`;
            case "function":
                return `"<Function[${value.name}]>"`;
            case "symbol":
                return `"<Symbol[${value.description ?? ""}]>"`;
        }
        if (value == null)
            return "null";
        if (value instanceof String)
            return stringify(value.valueOf());
        if (value instanceof BigInt)
            return stringify(value.valueOf());
        if (value instanceof Number)
            return stringify(value.valueOf());
        if (value instanceof Boolean)
            return stringify(value.valueOf());
        if (value instanceof Date)
            return stringify(value.toISOString());
        if (visited.has(value)) {
            return `"<Cyclic>"`;
        }
        visited.add(value);
        const str = Array.isArray(value)
            ? `[${value.map((v) => stringify(v, visited)).join(",")}]`
            : `{${Object.entries(value)
            .map(([k, v]) => `"${k}":${stringify(v, visited)}`)
            .join(",")}}`;
        visited.delete(value);
        return str;
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

    class ApiErr extends Err {
        constructor(message, info, cause) {
            super("ApiErr", message, info, cause);
        }
    }
    function wrapApiErr(err) {
        return err instanceof ApiErr
            ? err
            : new ApiErr("Unexpected Error", { statusCode: status.InternalServerError }, wrapErr(err));
    }

    function logRequest(ctx) {
        return (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const reqInfo = {
                name: "request_log",
                timestamp: new Date(),
                callId: callCtx.callId,
                method: req.method.toLowerCase(),
                url: req.url,
                headers: req.headers,
                rawBody: req.rawBody,
                params: req.params,
                query: req.query,
            };
            ctx.log.info(reqInfo);
            next();
        };
    }

    function logApiErr(ctx) {
        return (err, req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const apiErr = wrapApiErr(err);
            const errInfo = {
                name: "api_err_log",
                timestamp: new Date(),
                callId: callCtx.callId,
                info: apiErr.getInfo(),
                message: apiErr.chainMessage(),
            };
            ctx.log.info(errInfo);
            next(apiErr);
        };
    }

    function sendErrResponse(err, req, res, next) {
        const apiErr = wrapApiErr(err);
        const info = apiErr.getInfo();
        res.body = {
            name: apiErr.name,
            message: apiErr.message,
            info: info,
        };
        res.status(info.statusCode).json(res.body);
        next();
    }

    function logResponse(ctx) {
        return (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const resInfo = {
                name: "response_log",
                timestamp: new Date(),
                callId: callCtx.callId,
                status: res.statusCode,
                headers: res.getHeaders(),
                body: res.body,
            };
            ctx.log.info(resInfo);
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

    const parseRawBody = express.raw({
        type: "*/*",
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    });

    function newErrorLogInfo(err) {
        const wrapped = wrapErr(err);
        return {
            name: "error_log",
            timestamp: new Date(),
            err_name: wrapped.name,
            err_messages: wrapped.chainMessage(),
            err_stack: wrapped.stack ?? "",
        };
    }

    function parseJsonBody(req, res, next) {
        try {
            const raw = req.rawBody ?? "";
            req.body = raw === "" ? {} : JSON.parse(raw);
            next();
        }
        catch (err) {
            next(new ApiErr("Cannot parse body as JSON", { statusCode: status.BadRequest }, wrapErr(err)));
        }
    }

    function route(ctx, router, method, path, handler) {
        const wrappedHandler = async (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            // Validate request args
            const [args, typeErr] = validateType(handler.requestType, {
                ...req.body,
                ...req.query,
                ...req.params,
            });
            if (typeErr != null) {
                return next(new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr));
            }
            try {
                // Invoke handler with args
                const [result, apiErr] = await handler.handle(callCtx, args);
                if (apiErr != null) {
                    return next(apiErr);
                }
                res.body = result;
            }
            catch (err) {
                // Handle error when await failed
                callCtx.app.log.error(newErrorLogInfo(err));
                return next(wrapApiErr(err));
            }
            next();
        };
        router[method](path, [
            parseRawBody,
            logRequest(ctx),
            parseJsonBody,
            wrappedHandler,
            sendResponse,
            logApiErr(ctx),
            sendErrResponse,
            logResponse(ctx),
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
    class example_get {
        requestType = Req$4;
        async handle(ctx, req) {
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
        }
    }

    const Req$3 = typing.type({
        value: typing.type({
            str: typing.string,
            num: typing.number,
        }),
    });
    typing.type({
        example_id: typing.string,
    });
    class example_post {
        requestType = Req$3;
        async handle(ctx, req) {
            const example = {
                value_str: req.value.str,
                value_num: req.value.num,
                createTime: ctx.timestamp,
                updateTime: ctx.timestamp,
            };
            const exampleId = ctx.app.idGen.next();
            examples.set(exampleId, example);
            return [{ example_id: exampleId }, null];
        }
    }

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
    class example_example_id_get {
        requestType = Req$2;
        async handle(ctx, req) {
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
        }
    }

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
    class example_example_id_put {
        requestType = Req$1;
        async handle(ctx, req) {
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
        }
    }

    const Req = typing.type({
        example_id: typing.string,
    });
    typing.type({});
    class example_example_id_delete {
        requestType = Req;
        async handle(ctx, req) {
            const oldExample = examples.get(req.example_id);
            if (oldExample == null) {
                return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
            }
            examples.delete(req.example_id);
            return [{}, null];
        }
    }

    function api_route(ctx, router) {
        route(ctx, router, "get", "/example", new example_get());
        route(ctx, router, "post", "/example", new example_post());
        route(ctx, router, "get", "/example/:example_id", new example_example_id_get());
        route(ctx, router, "put", "/example/:example_id", new example_example_id_put());
        route(ctx, router, "delete", "/example/:example_id", new example_example_id_delete());
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
        routeDefault(ctx, router);
        const app = express();
        app.use(router);
        app.listen(ctx.env.APP_PORT, () => {
            console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
        });
    }
    function routeDefault(ctx, router) {
        const throwApiNotFound = (req, res, next) => {
            next(new ApiErr("API not found", { statusCode: status.NotFound }));
        };
        router.use([
            parseRawBody,
            logRequest(ctx),
            throwApiNotFound,
            logApiErr(ctx),
            sendErrResponse,
            logResponse(ctx),
        ]);
        return router;
    }

    const defaultConsole = console;
    class ConsoleLogger {
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
            log: new ConsoleLogger(),
        };
        showIds();
        server(ctx, (app) => {
            api_route(ctx, app);
        });
    }
    function showIds() {
        const idGen0 = new CryptoIdGen();
        for (let i = 0; i < 10; i++) {
            console.log(idGen0.next());
        }
        const idGen1 = new IncrementIdGen(1);
        for (let i = 0; i < 10; i++) {
            console.log(idGen1.next());
        }
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
