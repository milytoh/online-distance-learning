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
