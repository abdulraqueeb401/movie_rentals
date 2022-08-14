const express = require("express");
const { Customer, validateCustomer } = require("../models/customer");
const router = express.Router();

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.post("/", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
    });
    await customer.save();
    res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            isGold: req.body.isGold | false,
            phone: req.body.phone,
        },
        { new: true }
    );
    if (!customer)
        return res.status(404).send("A customer with given id is not found.");
    res.send(customer);
});

router.delete("/:id", async (req, res) => {
    const genre = await Customer.findByIdAndDelete(req.params.id);
    if (!genre)
        return res.status(404).send("A customer with given id is not found.");
    res.send(genre);
});

module.exports = router;
