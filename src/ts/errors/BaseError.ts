export class BaseError extends Error {
  constructor(name: string, message: string, cause?: Error) {
    super(message, { cause: cause });
    this.name = name;
    Error.captureStackTrace(this);
  }
  public chainMessage(): string {
    return chainMessage(this);
  }
}

export function chainMessage(err: Error): string {
  const cause = err.cause;
  if (cause instanceof Error) {
    return `${err.name}(${err.message}) : ${chainMessage(cause)}`;
  }
  return `${err.name}(${err.message}) : ${cause}`;
}
