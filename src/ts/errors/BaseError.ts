export abstract class BaseError extends Error {
  constructor(name: string, message: string, cause?: Error) {
    super(message, { cause });
    this.name = name;
    Error.captureStackTrace(this);
  }

  public chainMessage(): string {
    return chainMessageImpl(this).join(" | ");
  }

  public print(cerr: Console["error"] = console.error.bind(console)) {
    printErrImpl(this, cerr);
  }

  getInfo(): Record<string, unknown> {
    return {};
  }
}

function chainMessageImpl(err: Error): string[] {
  if (err.cause instanceof Error) {
    return [`${err.name}(${err.message})`, ...chainMessageImpl(err.cause)];
  }
  return [`${err.name}(${err.message})`, `${err.cause}`];
}

function printErrImpl(err: Error, cerr: Console["error"]) {
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
