const express = require;
const router = express.Router();
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} = require("../controllers/branch.controller");
const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");
e("express");

/* -------------------------------------------------------------------------- */
/*                                 🚀 Endpoints                               * /
/* -------------------------------------------------------------------------- */

router
  .route("/")
  .post(authenticateToken, checkSubscription, createBranch)
  .get(getAllBranches);
router
  .route("/:id")
  .get(getBranchById)
  .put(authenticateToken, checkSubscription, updateBranch)
  .delete(authenticateToken, checkSubscription, deleteBranch);

module.exports = router;
