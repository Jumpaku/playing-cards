import express from "express";
export function server() {
    const app = express();
    const port = 80;
    app.get("/", (req, res) => {
        res.send(req.headers);
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
