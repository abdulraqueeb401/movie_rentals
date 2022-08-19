const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("/api/genres", () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
        await User.deleteMany({});
    });
    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
            ]);
            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
            expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
        });
    });
    describe("GET /:id", () => {
        it("should return a genre if a valid id is passed", async () => {
            const genre = new Genre({ name: "genre" });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
        it("should return 404 a genre if  invalid id is passed", async () => {
            const res = await request(server).get(
                `/api/genres/${mongoose.Types.ObjectId()}`
            );
            expect(res.status).toBe(404);
        });
    });
    describe("POST /", () => {
        /*----Refractor tests----*/
        //Define the happy path, and then in each test,
        //we change one parameter that clearly aligns with
        //the name of the test.
        /*---- ************ ----*/
        let token;
        let name;
        const exec = async () => {
            return await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: name });
        };
        beforeEach(() => {
            //set values for happy path
            token = new User().generateAuthToken();
            name = "genre1";
        });
        it("should return 401 if client is not loggedin", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it("should return 400 if genre is less than 5 characters", async () => {
            name = "123";
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it("should return 400 if genre is more than 255 characters", async () => {
            name = new Array(257).join("a");
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it("should save genre if it is valid", async () => {
            await exec();
            const genre = await Genre.findOne({ name: "genre1" });
            expect(genre).not.toBeNull();
        });
        it("should return genre if it is valid", async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genre1");
        });
    });
    describe("PUT /:id", () => {
        it("should return 404 a genre if invalid id is passed", async () => {
            const res = await request(server)
                .put(`/api/genres/${mongoose.Types.ObjectId()}`)
                .send({ name: "genre1" });
            expect(res.status).toBe(404);
        });
        it("should return 400 if genre is less than 5 characters", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server)
                .put("/api/genres/" + genre._id)
                .send({ name: "123" });
            expect(res.status).toBe(400);
        });
        it("should return 400 if genre is greater than 255 characters", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const name = new Array(257).join("a");
            const res = await request(server)
                .put("/api/genres/" + genre._id)
                .send({ name: name });
            expect(res.status).toBe(400);
        });
        it("should save genre in database if it is valid", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server)
                .put("/api/genres/" + genre._id)
                .send({ name: "genre2" });
            const new_genre = await Genre.findById(genre._id);
            expect(new_genre).toHaveProperty("name", "genre2");
        });
        it("should return genre if it is valid", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server)
                .put("/api/genres/" + genre._id)
                .send({ name: "genre2" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "genre2");
        });
    });
    describe("DELETE /:id", () => {
        it("should return 403 if user is not admin", async () => {
            const userObj = { _id: mongoose.Types.ObjectId(), isAdmin: false };
            const token = new User(userObj).generateAuthToken();
            const res = await request(server)
                .delete("/api/genres/1")
                .set("x-auth-token", token);
            expect(res.status).toBe(403);
        });
        it("should return 404 a genre if invalid id is passed", async () => {
            const userObj = { _id: mongoose.Types.ObjectId(), isAdmin: true };
            const token = new User(userObj).generateAuthToken();
            const res = await request(server)
                .delete(`/api/genres/${mongoose.Types.ObjectId()}`)
                .set("x-auth-token", token);
            expect(res.status).toBe(404);
        });
        it("should return deleted genre if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const userObj = { _id: mongoose.Types.ObjectId(), isAdmin: true };
            const token = new User(userObj).generateAuthToken();
            const res = await request(server)
                .delete(`/api/genres/${genre._id}`)
                .set("x-auth-token", token);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ _id: genre._id, name: "genre1" });
        });
        it("should deleted genre in database if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const userObj = { _id: mongoose.Types.ObjectId(), isAdmin: true };
            const token = new User(userObj).generateAuthToken();
            const res = await request(server)
                .delete(`/api/genres/${genre._id}`)
                .set("x-auth-token", token);
            const new_genre = await Genre.findById(genre._id);
            expect(new_genre).toBeNull();
        });
    });
});
