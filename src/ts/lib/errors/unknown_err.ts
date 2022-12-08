import { Err } from "./base_err";

export class UnknownErr extends Err {
  constructor(cause?: Error) {
    super("UnknownErr", cause != null ? "error is wrapped" : "", {}, cause);
  }
}
