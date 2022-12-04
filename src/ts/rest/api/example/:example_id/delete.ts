import { Handler } from "../../../routing/route";
import typing, { TypeOf } from "io-ts";
import { RequestContext } from "../../../request_context";
import { Result } from "../../../../errors";
import { ApiErr } from "../../../api_err";

export const Req = typing.type({
  example_id: typing.string,
});
export type Req = TypeOf<typeof Req>;

export const Res = typing.type({});
export type Res = TypeOf<typeof Res>;

export const handler: Handler<Req, Res> = async (
  ctx: RequestContext,
  req: Req
): Promise<Result<Res, ApiErr>> => {
  return [{}, null];
};
