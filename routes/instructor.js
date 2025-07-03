const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require('../controllers/instructor')



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
  controller.getshowCreateForm
);


router.post(
  "/instructor/create-course",
  upload.single("media_file"), 
  ensureInstructor,
  controller.postCreateCourse
);

module.exports = router;
