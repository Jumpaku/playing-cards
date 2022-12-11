import typing from "io-ts";
import { ApiErr } from "../../../../api_err";
import { examples } from "../../../../../model/example";
import { status } from "../../../../utils";
export const Req = typing.type({
    example_id: typing.string,
});
export const Res = typing.type({
    example_id: typing.string,
    value: typing.type({
        str: typing.string,
        num: typing.number,
    }),
    create_time: typing.string,
    update_time: typing.string,
});
export const handler = async (ctx, req) => {
    const e = examples.get(req.example_id);
    if (e == null) {
        return [null, new ApiErr(`Not found`, { statusCode: status.NotFound })];
    }
    return [
        {
            example_id: req.example_id,
            value: {
                str: e.value_str,
                num: e.value_num,
            },
            create_time: e.createTime.toISOString(),
            update_time: e.updateTime.toISOString(),
        },
        null,
    ];
};
export default handler;
