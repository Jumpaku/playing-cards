import { Handler } from "../../../route";
import typing, { TypeOf } from "io-ts";
import { CallContext } from "../../../call_context";
import { Result } from "../../../../lib/errors";
import { ApiErr } from "../../../api_err";
import { Example, examples } from "../../../../model/example";
import { AppContext } from "../../../../app/context";

export const Req = typing.type({
  value: typing.type({
    str: typing.string,
    num: typing.number,
  }),
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({
  example_id: typing.string,
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  appCtx: AppContext,
  callCtx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  const example: Example = {
    value_str: req.value.str,
    value_num: req.value.num,
    createTime: callCtx.callTime,
    updateTime: callCtx.callTime,
  };
  const exampleId = appCtx.idGen.next();
  examples.set(exampleId, example);
  return [{ example_id: exampleId }, null];
};
export default handler;
