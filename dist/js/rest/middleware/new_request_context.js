export default function newRequestContext(app) {
    return (req, res, next) => {
        req.ctx = {
            app: app,
            token: "",
            timestamp: new Date(Date.now()),
        };
        next();
    };
}
