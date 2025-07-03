const db = require("../models/db");

// instructor ashboard
exports.getInstructorDashboard = async (req, res) => {
  const instructorId = req.session.user.id;
  const [courses] = await db.execute(
    "SELECT * FROM courses WHERE instructor_id = ?",
    [instructorId]
  );

  res.render("dashboard/instructorDashboard", {
    title: "Instructor Dashboard",
    user: req.session.user,
    isLogin: req.session.user,
    courses,
  });
};

// Show course creation form
exports.showCreateForm = (req, res) => {
  res.render("instructor/create-course", {
    title: "Create Course",
    user: req.session.user,
  });
};

// Handle course creation
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  const instructorId = req.session.user.id;

  try {
    await db.execute(
      "INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)",
      [title, description, instructorId]
    );
    res.redirect("/instructor/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Error creating course");
  }
};
