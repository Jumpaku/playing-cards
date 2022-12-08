import { Application } from "express";
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
} from "../route/example/:example_id/get";
import {
  handler as example_example_id_put,
  Req as example_example_id_put_Req,
} from "../route/example/:example_id/put";
import {
  handler as example_example_id_delete,
  Req as example_example_id_delete_Req,
} from "../route/example/:example_id/delete";
import validateJsonBody from "../../middleware/validate_request";

export function api_route(app: Application): Application {
  app.use("/example", validateJsonBody("get", example_get_Req));
  route(app, "get", "/example", example_get);
  app.use("/example", validateJsonBody("post", example_post_Req));
  route(app, "post", "/example", example_post);
  app.use(
    "/example/:example_id",
    validateJsonBody("get", example_example_id_get_Req)
  );
  route(app, "get", "/example/:example_id", example_example_id_get);
  app.use(
    "/example/:example_id",
    validateJsonBody("put", example_example_id_put_Req)
  );
  route(app, "put", "/example/:example_id", example_example_id_put);
  app.use(
    "/example/:example_id",
    validateJsonBody("delete", example_example_id_delete_Req)
  );
  route(
    app,
    "delete",
    "/example/:example_id/delete",
    example_example_id_delete
  );
  return app;
}
