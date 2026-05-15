const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobsController");
const { protect } = require("../middleware/auth");

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.patch("/:id", updateJobStatus);
router.delete("/:id", protect, deleteJob);

module.exports = router;
