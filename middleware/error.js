const logger = require("../startup/logging");
module.exports = function (err, req, res, next) {
    logger.error(err.message, err);
    //501 - internal server error
    res.status(501).send("something failed");
};
