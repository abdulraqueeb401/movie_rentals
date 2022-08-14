const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024,
    },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(4).max(255),
        email: Joi.string().required().min(4).max(255).email(),
        password: Joi.string().required().min(4).max(255),
    });
    return schema.validate(user);
}
moduele.exports = { User, validateUser };
