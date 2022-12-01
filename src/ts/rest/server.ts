import express from "express";
const app = express();
const port = 80;

export function server() {
  app.get("/", (req, res) => {
    res.send(req.headers);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
