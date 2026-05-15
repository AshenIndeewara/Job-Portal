const JobRequest = require("../models/JobRequest");

const getAllJobs = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    if (search) {
      filter.$text = { $search: search };
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      const err = new Error("Job not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "Closed"];

    if (!status) {
      const err = new Error("status field is required");
      err.statusCode = 400;
      return next(err);
    }

    if (!validStatuses.includes(status)) {
      const err = new Error(`status must be one of: ${validStatuses.join(", ")}`);
      err.statusCode = 400;
      return next(err);
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      const err = new Error("Job not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      const err = new Error("Job not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ message: "Job deleted successfully", id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJobStatus, deleteJob };
