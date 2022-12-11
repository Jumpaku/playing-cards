import { Env } from "./env";
import { IdGen } from "../lib/id_gen";

export type AppContext = {
  env: Env;
  idGen: IdGen;
};
