import typing from "io-ts";
import { examples } from "../../../../model/example";
export const Req = typing.type({
    value: typing.type({
        str: typing.string,
        num: typing.number,
    }),
});
export const Res = typing.type({
    example_id: typing.string,
});
export const handler = async (ctx, req) => {
    const example = {
        value_str: req.value.str,
        value_num: req.value.num,
        createTime: ctx.callTime,
        updateTime: ctx.callTime,
    };
    const exampleId = ctx.app.idGen.next();
    examples.set(exampleId, example);
    return [{ example_id: exampleId }, null];
};
export default handler;
