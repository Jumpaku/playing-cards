import { Err } from "./BaseErr";

export class PanicErr extends Err {
  constructor(message: string, cause?: Err) {
    super("PanicErr", message, {}, cause);
  }
}
