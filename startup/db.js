const mongoose = require("mongoose");
const logger = require("./logging");
module.exports = function () {
    mongoose
        .connect("mongodb://localhost/movie_rentals")
        .then(() => {
            logger.log("info", "connected to mongodb");
        })
        .catch((err) => logger.log("error", err.message, err));
};
