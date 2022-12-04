import { Err } from "./BaseErr";

export class UnknownErr extends Err {
  constructor(cause?: Error) {
    super("UnknownErr", cause != null ? "error is wrapped" : "", {}, cause);
  }
}
