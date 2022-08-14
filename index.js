const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const mongoose = require("mongoose");
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
// app.get("/", (req, res) => {
//     res.send("Hello, World");
// });

mongoose
    .connect("mongodb://localhost/movie_rentals")
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((err) => console.log(err.message));

const port = process.env.PORT | 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
