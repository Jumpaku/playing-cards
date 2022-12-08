import typing from "io-ts";
import { examples } from "../../../../model/example";
export const Req = typing.type({
    str_value: typing.string,
    num_value: typing.number,
});
export const Res = typing.type({
    example_id: typing.string,
});
export const handler = async (ctx, req) => {
    const example = {
        value: { str: req.str_value, num: req.num_value },
        createTime: ctx.timestamp,
        updateTime: ctx.timestamp,
    };
    const exampleId = ctx.app.idGen.next();
    examples.set(exampleId, example);
    return [{ example_id: exampleId }, null];
};
export default handler;
