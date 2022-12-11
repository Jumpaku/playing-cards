import { Router } from "express";
import { route } from "../../route";
import {
  handler as example_get,
  Req as example_get_Req,
} from "../route/example/get";
import {
  handler as example_post,
  Req as example_post_Req,
} from "../route/example/post";
import {
  handler as example_example_id_get,
  Req as example_example_id_get_Req,
} from "../route/example/[example_id]/get";
import {
  handler as example_example_id_put,
  Req as example_example_id_put_Req,
} from "../route/example/[example_id]/put";
import {
  handler as example_example_id_delete,
  Req as example_example_id_delete_Req,
} from "../route/example/[example_id]/delete";
import { AppContext } from "../../../app/context";

export function api_route(ctx: AppContext, router: Router): Router {
  route(ctx, router, "get", "/example", example_get_Req, example_get);
  route(ctx, router, "post", "/example", example_post_Req, example_post);
  route(
    ctx,
    router,
    "get",
    "/example/:example_id",
    example_example_id_get_Req,
    example_example_id_get
  );
  route(
    ctx,
    router,
    "put",
    "/example/:example_id",
    example_example_id_put_Req,
    example_example_id_put
  );
  route(
    ctx,
    router,
    "delete",
    "/example/:example_id",
    example_example_id_delete_Req,
    example_example_id_delete
  );

  return router;
}
