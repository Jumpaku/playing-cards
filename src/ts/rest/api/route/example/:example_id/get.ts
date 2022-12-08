import { Handler } from "../../../../route";
import typing, { TypeOf } from "io-ts";
import { CallContext } from "../../../../call_context";
import { Result } from "../../../../../lib/errors";
import { ApiErr } from "../../../../api_err";
import { examples } from "../../../../../model/example";
import { status } from "../../../../utils";

export const Req = typing.type({
  example_id: typing.string,
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({
  example_id: typing.string,
  str_value: typing.string,
  num_value: typing.number,
  create_time: typing.string,
  update_time: typing.string,
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  const e = examples.get(req.example_id);
  if (e == null) {
    return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
  }
  return [
    {
      example_id: req.example_id,
      str_value: e.value.str,
      num_value: e.value.num,
      create_time: e.createTime.toISOString(),
      update_time: e.updateTime.toISOString(),
    },
    null,
  ];
};
export default handler;
