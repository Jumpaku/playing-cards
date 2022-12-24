export default function prepareCallContext(app) {
    return (req, res, next) => {
        req.ctx = {
            app: app,
            callId: app.idGen.next(),
            callTime: new Date(),
            token: "",
        };
        next();
    };
}
