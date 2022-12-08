import typing from "io-ts";
import { ApiErr } from "../../../../api_err";
import { examples } from "../../../../../model/example";
import { status } from "../../../../utils";
export const Req = typing.type({
    example_id: typing.string,
    str_value: typing.union([typing.string, typing.undefined]),
    num_value: typing.union([typing.number, typing.undefined]),
});
export const Res = typing.type({});
export const handler = async (ctx, req) => {
    const oldExample = examples.get(req.example_id);
    if (oldExample == null) {
        return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
    }
    const newExample = { ...oldExample, value: { ...oldExample.value } };
    if (req.str_value != null) {
        newExample.value.str = req.str_value;
    }
    if (req.num_value != null) {
        newExample.value.num = req.num_value;
    }
    newExample.updateTime = ctx.timestamp;
    examples.set(req.example_id, newExample);
    return [{}, null];
};
export default handler;
