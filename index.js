require("express-async-errors");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const config = require("config");
const error = require("./middleware/error");
const logger = require("./startup/logging");
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR jwtPrivateKey is not set.");
    process.exit(1);
}

mongoose
    .connect("mongodb://localhost/movie_rentals")
    .then(() => {
        logger.log("info", "connected to mongodb");
    })
    .catch((err) => logger.log("error", err.message, err));

const port = process.env.PORT | 3000;
app.listen(port, () => {
    logger.log("info", `listening on port ${port}`);
});
