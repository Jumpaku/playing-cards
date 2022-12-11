export function defaultString(obj) {
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
