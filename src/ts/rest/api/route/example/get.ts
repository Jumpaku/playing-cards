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
      value: typing.type({
        str: typing.string,
        num: typing.number,
      }),
      create_time: typing.string,
      update_time: typing.string,
    })
  ),
});
export type Res = TypeOf<typeof Res>;

export default class implements Handler<Req, Res> {
  readonly requestType: typing.Type<Req> = Req;
  async handle(ctx: CallContext, req: Req): Promise<Result<Res, ApiErr>> {
    return [
      {
        list: [...examples.entries()].map(([k, v]) => ({
          example_id: k,
          value: { str: v.value_str, num: v.value_num },
          create_time: v.createTime.toISOString(),
          update_time: v.updateTime.toISOString(),
        })),
      },
      null,
    ];
  }
}
