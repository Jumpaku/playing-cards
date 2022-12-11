export function route(app, method, path, handler) {
    const wrap = async (req, res, next) => {
        const args = { ...req.body, ...req.query, ...req.params };
        const [result, apiErr] = await handler(req.ctx, args);
        if (apiErr != null) {
            return next(apiErr);
        }
        res.body = result;
    };
    app[method](path, async (req, res, next) => {
        wrap(req, res, next).catch(next);
    });
}
