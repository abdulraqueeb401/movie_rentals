module.exports = function (err, req, res, next) {
    console.error(err.message);
    //501 - internal server error
    res.status(501).send("something failed");
};
