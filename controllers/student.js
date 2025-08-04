const db = require("../models/db");

exports.dashboard = async (req, res) => {
    const studentId = req.session.user.id;
    console.log("omo");

  try {
    const [enrollments] = await db.execute(
      `SELECT c.id, c.title, c.description
       FROM completions e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = ?`,
      [studentId]
    );
    
    res.render("dashboard/studentDashboard", {
      title: "Student Dashboard",
      
      courses: enrollments,
      isLogin: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading dashboard");
  }
};
