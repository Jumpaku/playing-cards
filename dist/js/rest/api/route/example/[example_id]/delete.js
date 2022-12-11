import typing from "io-ts";
import { ApiErr } from "../../../../api_err";
import { examples } from "../../../../../model/example";
import { status } from "../../../../utils";
export const Req = typing.type({
    example_id: typing.string,
});
export const Res = typing.type({});
export const handler = async (ctx, req) => {
    const oldExample = examples.get(req.example_id);
    if (oldExample == null) {
        return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
    }
    examples.delete(req.example_id);
    return [{}, null];
};
export default handler;
