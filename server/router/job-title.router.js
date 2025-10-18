const express = require("express");
const router = express.Router();

const {
  createJobTitle,
  updateJobTitle,
  getJobTitles,
  getJobTitleById,
  deleteJobTitle,
} = require("../controllers/job-title.controller.js");

const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");
const JobTitle = require("../models/jop-title.model.js");

router
  .route("/")
  .post(authenticateToken, checkSubscription, createJobTitle)
  .get(getJobTitles);

router
  .route("/:id")
  .get(getJobTitleById)
  .put(authenticateToken, checkSubscription, updateJobTitle)
  .delete(authenticateToken, checkSubscription, deleteJobTitle);

module.exports = router;
