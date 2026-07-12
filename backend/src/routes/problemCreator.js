const express = require("express");
const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem
} = require("../controllers/userProblem");

/* ================= ADMIN ROUTES ================= */

// create problem
problemRouter.post("/create", adminMiddleware, createProblem);

// update problem
problemRouter.put("/update/:id", adminMiddleware, updateProblem);

// delete problem
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);


/* ================= USER ROUTES ================= */

// get single problem (used for update page also)
problemRouter.get("/problemById/:id", userMiddleware, getProblemById);

// get all problems (used in delete & update list)
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);

// solved problems by user
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);

// submitted problem
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);

problemRouter.get(
  "/admin/problem/:id",
  adminMiddleware,
  getProblemById
);

module.exports = problemRouter;
