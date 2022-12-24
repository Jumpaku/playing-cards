import { Env } from "./env";
import { IdGen } from "../lib/id_gen";
import { Logger } from "../lib/log/logger";

export type AppContext = {
  env: Env;
  idGen: IdGen;
  log: Logger;
};
