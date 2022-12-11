import { Err } from "./base_err";

export class IoErr extends Err {
  constructor(message: string, cause?: Err) {
    super("IoErr", message, {}, cause);
  }
}
