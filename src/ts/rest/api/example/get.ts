import { Handler } from "../../routing/route";
import typing, { TypeOf } from "io-ts";
import { RequestContext } from "../../request_context";
import { Result } from "../../../errors";
import { ApiErr } from "../../api_err";

export const Req = typing.type({
  example_id: typing.string,
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({
  list: typing.array(
    typing.type({
      example_id: typing.string,
      name: typing.string,
      value: typing.number,
      create_time: typing.string,
      update_time: typing.string,
    })
  ),
});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: RequestContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  return [
    {
      list: [
        {
          example_id: req.example_id,
          name: `Name`,
          value: 1,
          create_time: ctx.timestamp.toISOString(),
          update_time: ctx.timestamp.toISOString(),
        },
      ],
    },
    null,
  ];
};
