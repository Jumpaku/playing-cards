import { Handler } from "../../../route";
import typing, { TypeOf } from "io-ts";
import { CallContext } from "../../../call_context";
import { Result } from "../../../../lib/errors";
import { ApiErr } from "../../../api_err";
import { examples } from "../../../../model/example";

export const Req = typing.type({});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({
  list: typing.array(
    typing.type({
      example_id: typing.string,
      str_value: typing.string,
      num_value: typing.number,
      create_time: typing.string,
      update_time: typing.string,
    })
  ),
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: CallContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  return [
    {
      list: [...examples.entries()].map(([k, v]) => ({
        example_id: k,
        str_value: v.value.str,
        num_value: v.value.num,
        create_time: v.createTime.toISOString(),
        update_time: v.updateTime.toISOString(),
      })),
    },
    null,
  ];
};
export default handler;
