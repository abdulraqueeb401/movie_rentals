const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
let server;

afterAll(async () => {
    await server.close();
});

describe("/api/returns", () => {
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;
    const exec = function () {
        return request(server)
            .post("/api/returns")
            .set("x-auth-token", token)
            .send({ customerId, movieId });
    };
    beforeEach(async () => {
        server = require("../../index");
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: {
                name: "12345",
            },
            numberInStock: 10,
        });
        await movie.save();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "12345",
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2,
            },
        });
        await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });
    it("should return 401 if client not logged in", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it("should return 400 if customerId is not provided", async () => {
        customerId = "";
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 400 if movieId is not provided", async () => {
        movieId = "";
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 404 if no rental is found", async () => {
        await Rental.deleteMany({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it("should return 400 if rental is already processed", async () => {
        //return date is set
        rental = await Rental.findByIdAndUpdate(
            rental._id,
            { dateReturned: new Date() },
            { new: true }
        );
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 200 if request is valid", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it("should set the return date if input is valid", async () => {
        const res = await exec();
        const rentalinDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalinDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    it("should set rentalFee if input is valid", async () => {
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();
        const res = await exec();
        const rentalinDb = await Rental.findById(rental._id);
        expect(rentalinDb.rentalFee).toBe(14);
    });
    it("should increase movie stock if input is valid", async () => {
        const res = await exec();
        const movieObj = await Movie.findById(movieId);
        expect(movieObj.numberInStock).toBe(movie.numberInStock + 1);
    });
    it("should return rental if input is valid", async () => {
        const res = await exec();
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining([
                "dateOut",
                "dateReturned",
                "rentalFee",
                "customer",
                "movie",
            ])
        );
    });
});
