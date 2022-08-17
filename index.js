require("express-async-errors");
const express = require("express");
const app = express();

const logger = require("./startup/logging");
app.use(express.json());
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT | 3000;
app.listen(port, () => {
    logger.log("info", `listening on port ${port}`);
});
