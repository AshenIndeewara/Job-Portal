const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const JobRequest = require("../models/JobRequest");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/JobPortal_test";

process.env.JWT_SECRET = "test_secret_for_jest";

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
  await JobRequest.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("POST /api/auth/register", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@gmail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@gmail.com");
    expect(res.body.user.password).toBeUndefined();
  });

  it("returns 409 when email is already registered", async () => {
    await User.create({ name: "Existing", email: "dupe@gmail.com", password: "pass123" });

    const res = await request(app).post("/api/auth/register").send({
      name: "Another",
      email: "dupe@gmail.com",
      password: "pass123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe("Email already in use");
  });

  it("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "x@x.com" });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@gmail.com",
      password: "correctpassword",
    });
  });

  it("returns a token with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@gmail.com",
      password: "correctpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@gmail.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("returns 401 for unknown email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@gmail.com",
      password: "whatever",
    });

    expect(res.statusCode).toBe(401);
  });
});

describe("Auth-protected job routes", () => {
  let token;
  let jobId;

  beforeEach(async () => {
    const reg = await request(app).post("/api/auth/register").send({
      name: "Auth Tester",
      email: "authtester@gmail.com",
      password: "password123",
    });
    token = reg.body.token;

    const job = await JobRequest.create({ title: "Protected job", description: "desc" });
    jobId = job._id;
  });

  it("POST /api/jobs requires auth", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "Unauthorised job",
      description: "Should fail",
    });
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/jobs succeeds with valid token", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Auth job", description: "Should work" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Auth job");
  });

  it("DELETE /api/jobs/:id requires auth", async () => {
    const res = await request(app).delete(`/api/jobs/${jobId}`);
    expect(res.statusCode).toBe(401);
  });

  it("DELETE /api/jobs/:id succeeds with valid token", async () => {
    const res = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("returns 401 for a malformed token", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", "Bearer not.a.real.token")
      .send({ title: "Bad token", description: "desc" });

    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the logged-in user's profile", async () => {
    const reg = await request(app).post("/api/auth/register").send({
      name: "Me User",
      email: "me@gmail.com",
      password: "password123",
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${reg.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("me@gmail.com");
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});
