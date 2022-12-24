import { Handler } from "../../../../route";
import typing, { TypeOf } from "io-ts";
import { CallContext } from "../../../../call_context";
import { Result } from "../../../../../lib/errors";
import { ApiErr } from "../../../../api_err";
import { Example, examples } from "../../../../../model/example";
import { status } from "../../../../utils";

export const Req = typing.type({
  example_id: typing.string,
  value: typing.union([
    typing.undefined,
    typing.type({
      str: typing.union([typing.string, typing.undefined]),
      num: typing.union([typing.number, typing.undefined]),
    }),
  ]),
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  const oldExample = examples.get(req.example_id);
  if (oldExample == null) {
    return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
  }
  const newExample: Example = { ...oldExample };
  if (req.value == null) {
    return [{}, null];
  }
  if (req.value.str != null) {
    newExample.value_str = req.value.str;
  }
  if (req.value.num != null) {
    newExample.value_num = req.value.num;
  }
  newExample.updateTime = ctx.callTime;
  examples.set(req.example_id, newExample);
  return [{}, null];
};
export default handler;
