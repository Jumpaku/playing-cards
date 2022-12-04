import { Err } from "./base_err";

export class PanicErr extends Err {
  constructor(message: string, cause?: Err) {
    super("PanicErr", message, {}, cause);
  }
}
