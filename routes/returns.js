const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const moment = require("moment");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateRequest)], async (req, res) => {
    //writing the simplest code to pass the written test -- TDD
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send("No rental found");
    if (rental.dateReturned) return res.status(400).send("Already returned");
    rental.return();
    await rental.save();
    const movie = await Movie.findByIdAndUpdate(
        rental.movie._id,
        {
            $inc: { numberInStock: 1 },
        },
        { new: true }
    );

    return res.send(rental);
});

function validateRequest(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    return schema.validate(req);
}

module.exports = router;
