const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

afterAll(async () => {
    await server.close();
});

describe("auth middleware", () => {
    let token;
    beforeEach(() => {
        server = require("../../index");
        token = new User().generateAuthToken();
    });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });
    const exec = async () => {
        return await request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({ name: "genre1" });
    };
    it("should return 401 if no token is provided", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it("should return 400 if invalid token is provided", async () => {
        token = "a";
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it("should return 200 if valid token is provided", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});
