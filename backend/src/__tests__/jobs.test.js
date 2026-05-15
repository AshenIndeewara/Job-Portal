const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const JobRequest = require("../models/JobRequest");
const User = require("../models/User");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_for_jest";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/JobPortal_test";

let token;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);

  await User.deleteMany({});
  const res = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "testuser@gmail.com",
    password: "password123",
  });
  token = res.body.token;
});

afterEach(async () => {
  await JobRequest.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});


describe("POST /api/jobs", () => {
  it("creates a job with valid data and returns 201", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fix leaking tap",
        description: "Kitchen tap dripping badly",
        category: "Plumbing",
        location: "Glasgow",
        contactName: "Jane Doe",
        contactEmail: "jane@gmail.com",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Fix leaking tap");
    expect(res.body.status).toBe("Open");
    expect(res.body._id).toBeDefined();
  });

  it("returns 401 when no token provided", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "No auth",
      description: "Should be rejected",
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "No title provided" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when description is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Something" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fix tap",
        description: "Dripping tap",
        contactEmail: "not-an-email",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});


describe("GET /api/jobs", () => {
  beforeEach(async () => {
    await JobRequest.insertMany([
      { title: "Job A", description: "Desc A", category: "Plumbing", status: "Open" },
      { title: "Job B", description: "Desc B", category: "Electrical", status: "Closed" },
      { title: "Job C", description: "Desc C", category: "Plumbing", status: "In Progress" },
    ]);
  });

  it("returns all jobs", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.statusCode).toBe(200);
    expect(res.body.jobs).toHaveLength(3);
    expect(res.body.count).toBe(3);
  });

  it("filters by category", async () => {
    const res = await request(app).get("/api/jobs?category=Plumbing");
    expect(res.statusCode).toBe(200);
    expect(res.body.jobs).toHaveLength(2);
    res.body.jobs.forEach((j) => expect(j.category).toBe("Plumbing"));
  });

  it("filters by status", async () => {
    const res = await request(app).get("/api/jobs?status=Closed");
    expect(res.statusCode).toBe(200);
    expect(res.body.jobs).toHaveLength(1);
    expect(res.body.jobs[0].status).toBe("Closed");
  });
});


describe("GET /api/jobs/:id", () => {
  it("returns a single job by id", async () => {
    const job = await JobRequest.create({ title: "Single job", description: "Details" });
    const res = await request(app).get(`/api/jobs/${job._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Single job");
  });

  it("returns 404 for non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/jobs/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Job not found");
  });

  it("returns 400 for malformed id", async () => {
    const res = await request(app).get("/api/jobs/not-an-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid job ID format");
  });
});


describe("PATCH /api/jobs/:id", () => {
  it("updates status to In Progress (no auth needed)", async () => {
    const job = await JobRequest.create({ title: "Patch me", description: "desc" });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "In Progress" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("In Progress");
  });

  it("returns 400 for invalid status value", async () => {
    const job = await JobRequest.create({ title: "Bad status", description: "desc" });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "Pending" });

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when status field is missing", async () => {
    const job = await JobRequest.create({ title: "No status", description: "desc" });
    const res = await request(app).patch(`/api/jobs/${job._id}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: "Closed" });
    expect(res.statusCode).toBe(404);
  });
});


describe("DELETE /api/jobs/:id", () => {
  it("deletes a job and returns 200", async () => {
    const job = await JobRequest.create({ title: "Delete me", description: "desc" });
    const res = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Job deleted successfully");

    const gone = await JobRequest.findById(job._id);
    expect(gone).toBeNull();
  });

  it("returns 401 when no token provided", async () => {
    const job = await JobRequest.create({ title: "Protected", description: "desc" });
    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.statusCode).toBe(401);
  });

  it("returns 404 when job does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/jobs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
