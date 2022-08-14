const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().required().min(4).max(255),
        phone: Joi.string().required().min(5).max(255),
    });
    return schema.validate(customer);
}

module.exports = { Customer, customerSchema, validateCustomer };
