const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!validPassword)
        return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    res.send(token);
});

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().required().min(4).max(255).email(),
        password: Joi.string().required().min(4).max(255),
    });
    return schema.validate(user);
}
module.exports = router;
