const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

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
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivateKey")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(4).max(255),
        email: Joi.string().required().min(4).max(255).email(),
        password: Joi.string().required().min(4).max(255),
    });
    return schema.validate(user);
}
module.exports = { User, validateUser };
