const mongoose = require("mongoose");
const logger = require("./logging");
const config = require("config");
module.exports = function () {
    const db = config.get("db");
    mongoose
        .connect(db)
        .then(() => {
            logger.log("info", `connected to ${db}`);
        })
        .catch((err) => logger.log("error", err.message, err));
};
