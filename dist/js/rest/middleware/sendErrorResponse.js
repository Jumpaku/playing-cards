import { ApiError } from "../ApiError";
export default function sendErrorResponse(err, req, res, next) {
    if (err instanceof ApiError) {
        const info = err.getInfo();
        res.status(info.statusCode).json({
            name: err.name,
            message: err.message,
            info: info,
        });
    }
    next();
}
