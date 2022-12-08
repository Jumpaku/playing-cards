import { Err } from "./base_err";

export class InitErr extends Err {
  constructor(message: string, cause?: Err) {
    super("InitErr", message, {}, cause);
  }
}
