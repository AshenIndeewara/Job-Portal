const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
