const express = require("express");
const { Movie, validateMovie } = require("../models/movie");
const _ = require("lodash");
const { Genre } = require("../models/genre");
const router = express.Router();

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

router.post("/", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genreId");
    const movie = new Movie({
        title: req.body.title,
        genre: _.pick(genre, ["_id", "name"]),
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
});

router.put("/:id", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genreId");
    let movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: _.pick(genre, ["_id", "name"]),
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        },
        { new: true }
    );
    if (!movie)
        return res.status(404).send("A movie with given id is not found.");
    res.send(movie);
});

router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
        return res.status(404).send("A movie with given id is not found.");
    res.send(movie);
});

module.exports = router;
