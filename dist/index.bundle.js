(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('dotenv'), require('express')) :
    typeof define === 'function' && define.amd ? define(['dotenv', 'express'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotenv, global.express));
})(this, (function (dotenv, express) { 'use strict';

    const app = express();
    const port = 80;
    function server() {
        app.get("/", (req, res) => {
            res.send(req.headers);
        });
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }

    dotenv.config().parsed;
    function main() {
        console.log("hello");
        server();
    }
    main();

}));
//# sourceMappingURL=index.bundle.js.map
