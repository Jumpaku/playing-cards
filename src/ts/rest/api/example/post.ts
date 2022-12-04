import { Handler } from "../../routing/route";
import typing, { TypeOf } from "io-ts";
import { RequestContext } from "../../request_context";
import { Result } from "../../../errors";
import { ApiErr } from "../../api_err";

export const Req = typing.type({
  name: typing.string,
  value: typing.number,
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({
  example_id: typing.string,
  name: typing.string,
  value: typing.number,
  create_time: typing.string,
  update_time: typing.string,
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: RequestContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  return [
    {
      example_id: ctx.app.idGen.next(),
      name: req.name,
      value: req.value,
      create_time: ctx.timestamp.toISOString(),
      update_time: ctx.timestamp.toISOString(),
    },
    null,
  ];
};
