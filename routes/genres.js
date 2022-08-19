const express = require("express");
const { Genre, validateGenre } = require("../models/genre");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.get("/:id", async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Invalid id");
    res.send(genre);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({
        name: req.body.name,
    });
    await genre.save();
    res.send(genre);
});

router.put("/:id", async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        },
        { new: true }
    );
    if (!genre)
        return res.status(404).send("A genre with given id is not found.");
    res.send(genre);
});

// middleware 'admin' checks if the user has permission to delete -- admin or not.
router.delete("/:id", auth, admin, async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre)
        return res.status(404).send("A genre with given id is not found.");
    res.send(genre);
});

module.exports = router;
