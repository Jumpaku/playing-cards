import typing from "io-ts";
import { examples } from "../../../../model/example";
export const Req = typing.type({});
export const Res = typing.type({
    list: typing.array(typing.type({
        example_id: typing.string,
        str_value: typing.string,
        num_value: typing.number,
        create_time: typing.string,
        update_time: typing.string,
    })),
});
export const handler = async (ctx, req) => {
    return [
        {
            list: [...examples.entries()].map(([k, v]) => ({
                example_id: k,
                str_value: v.value.str,
                num_value: v.value.num,
                create_time: v.createTime.toISOString(),
                update_time: v.updateTime.toISOString(),
            })),
        },
        null,
    ];
};
export default handler;
