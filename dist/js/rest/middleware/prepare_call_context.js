export default function prepareCallContext(app) {
    return (req, res, next) => {
        req.ctx = {
            app: app,
            token: "",
            timestamp: new Date(Date.now()),
        };
        next();
    };
}
