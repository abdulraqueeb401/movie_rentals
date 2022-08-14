const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort([
        ["customer.name"],
        ["movie.title"],
    ]);
    res.send(rentals);
});
router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send("Invalid rental id");
    res.send(rental);
});

router.post("/", async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send("Invalid request.");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Invalid movie id");
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Invalid customer id");
    const rental = new Rental({
        customer: customer,
        movie: _.pick(movie, ["_id", "title", "dailyRentalRate"]),
    });
    await rental.save();
    res.send(rental);
});

module.exports = router;
