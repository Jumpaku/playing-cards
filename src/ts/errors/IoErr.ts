import { Err } from "./BaseErr";

export class IoErr extends Err {
  constructor(message: string, cause?: Err) {
    super("IoErr", message, {}, cause);
  }
}
