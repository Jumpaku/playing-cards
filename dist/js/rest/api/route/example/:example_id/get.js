import typing from "io-ts";
import { ApiErr } from "../../../../api_err";
import { examples } from "../../../../../model/example";
import { status } from "../../../../utils";
export const Req = typing.type({
    example_id: typing.string,
});
export const Res = typing.type({
    example_id: typing.string,
    str_value: typing.string,
    num_value: typing.number,
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
            str_value: e.value.str,
            num_value: e.value.num,
            create_time: e.createTime.toISOString(),
            update_time: e.updateTime.toISOString(),
        },
        null,
    ];
};
export default handler;
