import { status } from "../utils";
export default function sendResponse(req, res, next) {
    res.status(status.Ok).json(res.body ?? {});
    next();
}
