import { Handler } from "../../../route";
import typing, { TypeOf } from "io-ts";
import { CallContext } from "../../../call_context";
import { Result } from "../../../../lib/errors";
import { ApiErr } from "../../../api_err";
import { Example, examples } from "../../../../model/example";

export const Req = typing.type({
  str_value: typing.string,
  num_value: typing.number,
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({
  example_id: typing.string,
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  const example: Example = {
    value: { str: req.str_value, num: req.num_value },
    createTime: ctx.timestamp,
    updateTime: ctx.timestamp,
  };
  const exampleId = ctx.app.idGen.next();
  examples.set(exampleId, example);
  return [{ example_id: exampleId }, null];
};
export default handler;
