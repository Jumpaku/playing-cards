import { raw } from "express";
import { Request } from "../utils";

const parseRawBody = raw({
  type: "*/*",
  verify: (req: Request, res, buf) => {
    req.rawBody = buf.toString();
  },
});
export default parseRawBody;
