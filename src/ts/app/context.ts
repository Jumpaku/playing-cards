import { Env } from "./env";
import { IdGen } from "../lib/id_gen";
import { Logger } from "../lib/log/logger";
import { Clock } from "../lib/clock";

export type AppContext = {
  env: Env;
  idGen: IdGen;
  clock: Clock;
  log: Logger;
};
