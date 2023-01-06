import { Handler } from "../../../../route";
import typing, { TypeOf } from "io-ts";
import { CallContext } from "../../../../call_context";
import { Result } from "../../../../../lib/errors";
import { ApiErr } from "../../../../api_err";
import { examples } from "../../../../../model/example";
import { status } from "../../../../utils";
import { AppContext } from "../../../../../app/context";

export const Req = typing.type({
  example_id: typing.string,
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  appCtx: AppContext,
  callCtx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  const oldExample = examples.get(req.example_id);
  if (oldExample == null) {
    return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
  }
  examples.delete(req.example_id);
  return [{}, null];
};
export default handler;
