import { Err } from "./BaseErr";

export class InitErr extends Err {
  constructor(message: string, cause?: Err) {
    super("InitErr", message, {}, cause);
  }
}
