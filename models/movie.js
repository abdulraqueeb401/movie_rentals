const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(255),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required().min(0).max(255),
        dailyRentalRate: Joi.number().required().min(0).max(255),
    });
    return schema.validate(movie);
}

module.exports = { Movie, validateMovie };
