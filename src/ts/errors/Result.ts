import { Err } from "./BaseErr";

export type Result<V, E extends Err> = [V, null] | [null, E];
