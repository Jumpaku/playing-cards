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

export const Res = typing.type({
  example_id: typing.string,
  value: typing.type({
    str: typing.string,
    num: typing.number,
  }),
  create_time: typing.string,
  update_time: typing.string,
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  appCtx: AppContext,
  callCtx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  const e = examples.get(req.example_id);
  if (e == null) {
    return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
  }
  return [
    {
      example_id: req.example_id,
      value: {
        str: e.value_str,
        num: e.value_num,
      },
      create_time: e.createTime.toISOString(),
      update_time: e.updateTime.toISOString(),
    },
    null,
  ];
};
export default handler;
