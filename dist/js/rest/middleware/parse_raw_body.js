import { raw } from "express";
const parseRawBody = raw({
    type: "*/*",
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
});
export default parseRawBody;
