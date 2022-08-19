const logger = require("../startup/logging");
module.exports = function (err, req, res, next) {
    logger.error(err.message, err);
    //500 - internal server error
    res.status(500).send("something failed");
};
