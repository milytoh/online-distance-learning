const db = require("../models/db");

// instructor ashboard
exports.getInstructorDashboard = async (req, res) => {
  const instructorId = req.session.user.id;

  try {
    // Fetch courses by instructor
    const [courses] = await db.execute(
      "SELECT * FROM courses WHERE instructor_id = ?",
      [instructorId]
    );

    // Fetch all media files for those courses
    const [mediaFiles] = await db.execute(
      `
      SELECT * FROM media_files
      WHERE course_id IN (
        SELECT id FROM courses WHERE instructor_id = ?
      )
    `,
      [instructorId]
    );

    // Attach media files to each course
    const coursesWithMedia = courses.map((course) => {
      const files = mediaFiles.filter((file) => file.course_id === course.id);
      return { ...course, media: files };
    });

    res.render("dashboard/instructorDashboard", {
      title: "Instructor Dashboard",
      user: req.session.user,
      courses: coursesWithMedia,
      isLogin: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading dashboard");
  }
};

// Show course creation form
exports.getshowCreateForm = (req, res) => {
  res.render("onlinecourse/instructor-course-form", {
    title: "Create Course",
    user: req.session.user,
    isLogin: req.session.user
  });
};

// Handle course creation
exports.postCreateCourse = async (req, res) => {
  const { title, description } = req.body;
  const instructorId = req.session.user.id;

  try {
    // Insert course
    const [result] = await db.execute(
      "INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)",
      [title, description, instructorId]
    );
    const courseId = result.insertId;

    // Save uploaded file (if exists)
    if (req.file) {
      const fileType = req.file.mimetype.includes("video")
        ? "video"
        : req.file.mimetype.includes("pdf")
        ? "pdf"
        : "image";

      await db.execute(
        "INSERT INTO media_files (course_id, filename, file_type) VALUES (?, ?, ?)",
        [courseId, req.file.filename, fileType]
      );
    }

    res.redirect("/instructor/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Error creating course");
  }
};

exports.showEditForm = async (req, res) => {
  const courseId = req.params.id;

  const [rows] = await db.execute("SELECT * FROM courses WHERE id = ?", [
    courseId,
  ]);
  const course = rows[0];

  if (!course || course.instructor_id !== req.session.user.id) {
    return res.send("Unauthorized or course not found");
  }

  res.render("dashboard/course-edit", { title: "Edit Course", course, isLogin: req.session.user });
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { title, description } = req.body;

  try {
    await db.execute(
      "UPDATE courses SET title = ?, description = ? WHERE id = ? AND instructor_id = ?",
      [title, description, courseId, req.session.user.id]
    );

    res.redirect("/instructor/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Error updating course");
  }
};


exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  const instructorId = req.session.user.id;

 
  try {
    // First delete all comments for this course
    await db.execute("DELETE FROM comments WHERE course_id = ?", [courseId]);
    // Delete completions
    await db.execute("DELETE FROM completions WHERE course_id = ?", [courseId]);
    await db.execute("DELETE FROM courses WHERE id = ? AND instructor_id = ?", [
      courseId,
      instructorId,
    ]);

    res.redirect("/instructor/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Error deleting course");
  }
};


exports.viewComments = async (req, res) => {
  const instructorId = req.session.user.id;

  const [comments] = await db.execute(
    `
    SELECT c.*, u.name AS student_name, co.title AS course_title
    FROM comments c
    JOIN users u ON c.student_id = u.id
    JOIN courses co ON c.course_id = co.id
    WHERE co.instructor_id = ?
    ORDER BY c.created_at DESC
  `,
    [instructorId]
  );

  res.render("dashboard/view-comments", {
    title: "Student Comments",
    comments,
  });
};

exports.replyToComment = async (req, res) => {
  const commentId = req.params.id;
  const { reply } = req.body;
  const instructorId = req.session.user.id;

  try {
    // Verify comment belongs to instructor's course
    const [rows] = await db.execute(
      `
      SELECT c.id FROM comments c
      JOIN courses co ON c.course_id = co.id
      WHERE c.id = ? AND co.instructor_id = ?
    `,
      [commentId, instructorId]
    );

    if (rows.length === 0) return res.send("Unauthorized");

    await db.execute("UPDATE comments SET reply = ? WHERE id = ?", [
      reply,
      commentId,
    ]);

    res.redirect("/instructor/comments");
  } catch (err) {
    console.error(err);
    res.send("Error replying to comment");
  }
};



