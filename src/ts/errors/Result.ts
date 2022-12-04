import { Err } from "./base_err";

export type Result<V, E extends Err> = [V, null] | [null, E];
