import { BaseError } from "./BaseError";

export type Result<V, E extends BaseError> = [V, null] | [null, E];
