import { defaultString } from "../strings";

export function instanceOfErr(obj: unknown): obj is Err {
  return obj instanceof Err;
}

export class Err<
  Info extends Record<string, unknown> = Record<string, unknown>
> extends Error {
  constructor(
    name: string,
    message: string,
    private info: Info,
    cause?: Error
  ) {
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

  getInfo(): Info {
    return this.info;
  }
}

function chainMessageImpl(err: Error): string[] {
  const cause = err.cause;
  if (cause instanceof Error) {
    return [`${err.name}(${err.message})`, ...chainMessageImpl(cause)];
  }
  return [`${err.name}(${err.message})`, `${defaultString(cause)}`];
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
