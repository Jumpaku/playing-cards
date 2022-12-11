import { route } from "../../route";
import example_get from "../route/example/get";
import example_post from "../route/example/post";
import example_example_id_get from "../route/example/[example_id]/get";
import example_example_id_put from "../route/example/[example_id]/put";
import example_example_id_delete from "../route/example/[example_id]/delete";
export function api_route(ctx, router) {
    route(ctx, router, "get", "/example", new example_get());
    route(ctx, router, "post", "/example", new example_post());
    route(ctx, router, "get", "/example/:example_id", new example_example_id_get());
    route(ctx, router, "put", "/example/:example_id", new example_example_id_put());
    route(ctx, router, "delete", "/example/:example_id", new example_example_id_delete());
    return router;
}
