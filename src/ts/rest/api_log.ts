import { Result } from "../lib/errors";
import { LogInfo } from "../lib/log/log_info";
import { ApiErr, ApiErrRes } from "./api_err";
import { CallContext } from "./call_context";

export type ApiCallInfo = LogInfo & {
  name: "api_call_log";
  callId: string;
  callTime: Date;
  request: unknown;
  response?: unknown;
  errorResponse?: ApiErrRes;
};

export function newApiCallInfo(
  ctx: CallContext,
  req: unknown,
  [res, err]: Result<unknown, ApiErr>
): ApiCallInfo {
  const info = {
    name: "api_call_log",
    logTime: new Date(),
    callId: ctx.callId,
    callTime: ctx.callTime,
    request: req,
  } as const;
  return Object.assign(
    info,
    err != null ? { errorResponse: err.asResponse() } : { response: res }
  );
}
