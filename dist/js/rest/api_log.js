export function newApiCallInfo(ctx, req, [res, err]) {
    const info = {
        name: "api_call_log",
        logTime: new Date(),
        callId: ctx.callId,
        callTime: ctx.timestamp,
        request: req,
    };
    return Object.assign(info, err != null ? { errorResponse: err.asResponse() } : { response: res });
}
