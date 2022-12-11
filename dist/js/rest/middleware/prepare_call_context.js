export default function prepareCallContext(app) {
    return (req, res, next) => {
        req.ctx = {
            app: app,
            callId: app.idGen.next(),
            token: "",
            timestamp: new Date(Date.now()),
        };
        next();
    };
}
