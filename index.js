require("express-async-errors");
const express = require("express");
const app = express();

const logger = require("./startup/logging");
app.use(express.json());
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    logger.log("info", `listening on port ${port}`);
});
module.exports = server;
