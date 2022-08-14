const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
});

const Genre = mongoose.model("Genre", genreSchema);
// const genre = { name: "" };
// const { error } = validateGenre(genre);
// if (error) console.log(error.details[0].message);
// else console.log(genre);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
    });
    return schema.validate(genre);
}
module.exports = { Genre, validateGenre, genreSchema };
