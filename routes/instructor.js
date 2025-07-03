const express = require("express");
const router = express.Router();
const controller = require("../controllers/instructor");

// Middleware to restrict to instructors
const ensureInstructor = (req, res, next) => {
  if (req.session.user?.role === "instructor") {
    return next();
  }
  res.redirect("/login");
};

// Dashboard & Create Course
router.get("/instructor/dashboard", ensureInstructor, controller.getInstructorDashboard);

router.get(
  "/instructor/create-course",
  ensureInstructor,
  controller.showCreateForm
);
router.post(
  "/instructor/create-course",
  ensureInstructor,
  controller.createCourse
);

module.exports = router;
