import { Env } from "./env";
import { IdGen } from "./random/id_gen";

export type AppContext = {
  env: Env;
  idGen: IdGen;
};
