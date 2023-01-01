(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('yargs'), require('crypto'), require('fs/promises'), require('process'), require('express'), require('io-ts'), require('dotenv')) :
    typeof define === 'function' && define.amd ? define(['yargs', 'crypto', 'fs/promises', 'process', 'express', 'io-ts', 'dotenv'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.yargs, global.crypto, global.fp, global.process$1, global.express, global.typing, global.dotenv));
})(this, (function (yargs, crypto, fp, process$1, express, typing, dotenv) { 'use strict';

    async function parseArgs(args) {
        return yargs
            .scriptName("jumpaku/playing-cards")
            .command("serve [options]", "Start server", (yargs) => yargs.options({
            env: {
                type: "string",
                default: ".env",
                describe: "Path of dotenv file",
                requiresArg: true,
            },
            config: {
                type: "string",
                default: "config.yml",
                describe: "Path of configuration yml file",
                requiresArg: true,
            },
        }))
            .command("show <content> <target_command> [options]", "Show variables", (yargs) => yargs
            .positional("content", {
            choices: ["env", "config", "args"],
        })
            .positional("target_command", { choices: ["serve"] }))
            .version(false)
            .parse(args);
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
                return `"${value.replaceAll(`"`, '\\"')}"`;
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

    const defaultConsole = console;
    class FileLogger {
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

    function instanceOfErr(obj) {
        return obj instanceof Err;
    }
    function panic(cause) {
        if (!(cause instanceof Err)) {
            panic(wrapErr(cause));
        }
        console.error(new PanicErr("Panic!", cause));
        process$1.exit(1);
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
        asResponse() {
            return {
                name: this.name,
                message: this.message,
                info: this.getInfo(),
            };
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
                logTime: new Date(),
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
                logTime: new Date(),
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
        res.body = apiErr.asResponse();
        res.status(apiErr.getInfo().statusCode).json(res.body);
        next();
    }

    function logResponse(ctx) {
        return (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            const resInfo = {
                name: "response_log",
                logTime: new Date(),
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

    function newApiCallInfo(ctx, req, [res, err]) {
        const info = {
            name: "api_call_log",
            logTime: new Date(),
            callId: ctx.callId,
            callTime: ctx.callTime,
            request: req,
        };
        return Object.assign(info, err != null ? { errorResponse: err.asResponse() } : { response: res });
    }

    function newErrLogInfo(err) {
        const wrapped = wrapErr(err);
        return {
            name: "error_log",
            logTime: new Date(),
            errName: wrapped.name,
            errMessages: wrapped.chainMessage(),
            errStack: wrapped.stack ?? "",
        };
    }

    function route(ctx, router, method, path, reqType, handler) {
        const wrappedHandler = async (req, res, next) => {
            const callCtx = req.ctx;
            requireNonNull(callCtx);
            // Validate request args
            const [args, typeErr] = validateType(reqType, {
                ...req.body,
                ...req.query,
                ...req.params,
            });
            if (typeErr != null) {
                return next(new ApiErr("Bad request", { statusCode: status.BadRequest }, typeErr));
            }
            try {
                // Invoke handler with args
                const result = await handler(callCtx, args);
                ctx.log.info(newApiCallInfo(callCtx, args, result));
                const [resBody, apiErr] = result;
                if (apiErr != null) {
                    return next(apiErr);
                }
                res.body = resBody;
            }
            catch (err) {
                // Handle error when await failed
                ctx.log.error(newErrLogInfo(err));
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
            createTime: ctx.callTime,
            updateTime: ctx.callTime,
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
        newExample.updateTime = ctx.callTime;
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
                callTime: new Date(),
                token: "",
            };
            next();
        };
    }

    function server(ctx, routing, callback) {
        const router = express.Router();
        router.use(prepareCallContext(ctx));
        routing(router);
        routeDefault(ctx, router);
        const app = express();
        app.use(router);
        const s = app.listen(ctx.env.APP_PORT, () => {
            console.log(`Example app listening on port ${ctx.env.APP_PORT}`);
        });
        callback(s);
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

    const Env = typing.type({
        APP_STAGE: typing.string,
        APP_PORT: typing.string,
        LOG_PATH: typing.string,
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

    class InitErr extends Err {
        constructor(message, cause) {
            super("InitErr", message, {}, cause);
        }
    }

    function serve(args, envFile, configFile) {
        const [env, err] = newEnv(envFile);
        if (err != null) {
            return [null, new InitErr("failed loading env file", err)];
        }
        const ctx = {
            env,
            idGen: new CryptoIdGen(),
            log: new FileLogger(env.LOG_PATH, console),
        };
        server(ctx, (app) => api_route(ctx, app), (server) => {
            process.on("SIGTERM", () => {
                console.log("SIGTERM signal received: closing HTTP server");
                server.close(() => {
                    console.log("HTTP server closed");
                });
            });
        });
        return [undefined, null];
    }

    class BadArgsErr extends Err {
        constructor(message, info, cause) {
            super("BadArgsErr", message, info, cause);
        }
    }

    function show(args) {
        switch (args.target_command) {
            case "serve":
                return showServe(args, args.content, args.env, args.config);
            default:
                return [
                    null,
                    new BadArgsErr("bad argument", {
                        args: { target_command: args.target_command },
                    }),
                ];
        }
    }
    function showServe(args, content, envFile, configFile) {
        switch (content) {
            case "env":
                const [env, err] = newEnv(envFile);
                if (err != null) {
                    return [null, new IoErr("fail loading env", err)];
                }
                console.log(env);
                return [undefined, null];
            case "config":
                console.log("Nothing to show");
                return [undefined, null];
            case "args":
                console.log({
                    target_command: "serve",
                    env: envFile,
                    config: configFile,
                });
                return [undefined, null];
            default:
                return [
                    null,
                    new BadArgsErr(`content must be one of "env", "config", or "args"`, {
                        args: content,
                    }),
                ];
        }
    }

    class CliErr extends Err {
        constructor(message, info, cause) {
            super("CliErr", message, info, cause);
        }
    }

    function handleErr(args, command, err) {
        return err != null
            ? [
                null,
                new CliErr(`${command} failed`, {
                    args: args,
                    command: `${command}`,
                    exitCode: 1,
                }, err),
            ]
            : [undefined, null];
    }
    async function runApp(args) {
        const parsed = await parseArgs(args);
        const [command] = parsed._;
        switch (command) {
            case "serve": {
                const [, err] = serve(parsed, parsed.env, parsed.config);
                return handleErr(parsed, command, err);
            }
            case "show": {
                const [, err] = show(parsed);
                return handleErr(parsed, command, err);
            }
            default:
                return [
                    null,
                    new CliErr("bad command", {
                        args: parsed,
                        command: `${command}`,
                        exitCode: 1,
                    }),
                ];
        }
    }

    async function main() {
        const [, err] = await runApp(process.argv.slice(2));
        if (err != null) {
            console.error(err.chainMessage());
            err.print();
            process.exit(err.getInfo().exitCode);
        }
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
