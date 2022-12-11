export function defaultString(obj: unknown): string {
  return stringify(obj);
}

export function stringify(
  value: unknown,
  visited: Set<unknown> = new Set()
): string {
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
  if (value == null) return "null";
  if (value instanceof String) return stringify(value.valueOf());
  if (value instanceof BigInt) return stringify(value.valueOf());
  if (value instanceof Number) return stringify(value.valueOf());
  if (value instanceof Boolean) return stringify(value.valueOf());
  if (value instanceof Date) return stringify(value.toISOString());
  if (visited.has(value)) {
    return `"<Cyclic>"`;
  }
  visited.add(value);
  const str: string = Array.isArray(value)
    ? `[${value.map((v) => stringify(v, visited)).join(",")}]`
    : `{${Object.entries(value)
        .map(([k, v]) => `"${k}":${stringify(v, visited)}`)
        .join(",")}}`;
  visited.delete(value);
  return str;
}
