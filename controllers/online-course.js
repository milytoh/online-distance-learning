const db = require("../models/db");

exports.getIndex = async (req, res, next) => {
  try {
    // Fetch all courses + instructor name
    const [courses] = await db.execute(`
      SELECT c.*, u.name AS instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
    `);

    res.render("index", {
      title: "Home",
      user: req.session.user,
      courses,
      isLogin: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading courses");
  }


 };

exports.getAllCoures = async (req, res, next) => {
  
  try {
    // Fetch all courses + instructor name
    const [courses] = await db.execute(`
      SELECT c.*, u.name AS instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
    `);

   
    res.render("onlinecourse/course-list", {
      title: "Student Dashboard",
      user: req.session.user,
      courses,
      isLogin: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading courses");
  }
};

exports.getCourseDetail = async (req, res, next) => {
  const courseId = req.params.id;
  const studentId = req.session.user.id;

  try {
    const [courseRows] = await db.execute(
      "SELECT * FROM courses WHERE id = ?",
      [courseId]
    );
    const course = courseRows[0];

    const [mediaFiles] = await db.execute(
      "SELECT * FROM media_files WHERE course_id = ?",
      [courseId]
    );

    // Check if this student has marked the course as completed
    const [completionRows] = await db.execute(
      "SELECT * FROM completions WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
    );

    const isCompleted = completionRows.length > 0;

    res.render("onlinecourse/course-detail", {
      title: course.title,
      course,
      mediaFiles,
      isCompleted,
      isLogin: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading course");
  }
}


exports.markAsCompleted = async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.session.user.id;

  try {
    await db.execute(
      "INSERT IGNORE INTO completions (student_id, course_id) VALUES (?, ?)",
      [studentId, courseId]
    );
    res.redirect(`/course/${courseId}`);
  } catch (err) {
    console.error(err);
    res.send("Error marking course as completed");
  }
};


