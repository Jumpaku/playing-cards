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

export const Res = typing.type({});
export type Res = TypeOf<typeof Res>;

export default class implements Handler<Req, Res> {
  readonly requestType: typing.Type<Req> = Req;
  async handle(ctx: CallContext, req: Req): Promise<Result<Res, ApiErr>> {
    const oldExample = examples.get(req.example_id);
    if (oldExample == null) {
      return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
    }
    examples.delete(req.example_id);
    return [{}, null];
  }
}
