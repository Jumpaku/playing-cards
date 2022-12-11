import typing from "io-ts";
import { examples } from "../../../../model/example";
export const Req = typing.type({});
export const Res = typing.type({
    list: typing.array(typing.type({
        example_id: typing.string,
        value: typing.type({
            str: typing.string,
            num: typing.number,
        }),
        create_time: typing.string,
        update_time: typing.string,
    })),
});
export default class {
    requestType = Req;
    async handle(ctx, req) {
        return [
            {
                list: [...examples.entries()].map(([k, v]) => ({
                    example_id: k,
                    value: { str: v.value_str, num: v.value_num },
                    create_time: v.createTime.toISOString(),
                    update_time: v.updateTime.toISOString(),
                })),
            },
            null,
        ];
    }
}
