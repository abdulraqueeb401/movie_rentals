const mongoose = require("mongoose");
const Joi = require("joi");
const { customerSchema } = require("../models/customer");
Joi.objectId = require("joi-objectid")(Joi);

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        default: Date.now(),
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});
const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    return schema.validate(rental);
}

module.exports = { Rental, validateRental };
