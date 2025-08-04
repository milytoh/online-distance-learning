const path = require("path");

const PDFDocument = require("pdfkit");
const moment = require("moment");

const db = require("../models/db");

exports.getIndex = async (req, res, next) => {
  const searchQuery = req.query.search || "";
  // try {
  //   // Fetch all courses + instructor name
  //   const [courses] = await db.execute(`
  //     SELECT c.*, u.name AS instructor_name
  //     FROM courses c
  //     JOIN users u ON c.instructor_id = u.id
  //   `);
  try {
    let courses;
    if (searchQuery) {
      [courses] = await db.execute(
        `SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.instructor_id = u.id
         WHERE c.title LIKE ?`,
        [`%${searchQuery}%`]
      );
    } else {
      [courses] = await db.execute(
        `SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.instructor_id = u.id`
      );
    }

    res.render("index", {
      title: "Home",
      user: req.session.user,
      courses,
      isLogin: req.session.user,
      searchQuery,
     
    }); 
  } catch (err) {
    console.error(err);
    res.send("Error loading courses");
  }
};

exports.getAllCoures = async (req, res, next) => {
  const searchQuery = req.query.search || "";
  // try {
  //   // Fetch all courses + instructor name
  //   const [courses] = await db.execute(`
  //     SELECT c.*, u.name AS instructor_name 
  //     FROM courses c
  //     JOIN users u ON c.instructor_id = u.id
  //   `);
  try {
    let courses;
    if (searchQuery) {
      [courses] = await db.execute(
        `SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.instructor_id = u.id
         WHERE c.title LIKE ?`,
        [`%${searchQuery}%`]
      );
    } else {
      [courses] = await db.execute(
        `SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.instructor_id = u.id`
      );
    }

    res.render("onlinecourse/course-list", {
      title: "Student Dashboard",
      user: req.session.user,
      courses,
      isLogin: req.session.user,
      searchQuery
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

    // Load all comments for this course
    const [commentRows] = await db.execute(
      `
      SELECT c.*, u.name AS student_name
      FROM comments c
      JOIN users u ON c.student_id = u.id
      WHERE c.course_id = ?
      ORDER BY c.created_at DESC
    `,
      [courseId]
    );

    res.render("onlinecourse/course-detail", {
      title: course.title,
      course,
      mediaFiles,
      isCompleted,
      isLogin: req.session.user,
      comments: commentRows,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading course");
  }
};

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

exports.postComment = async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.session.user.id;
  const { content } = req.body;

  try {
    await db.execute(
      "INSERT INTO comments (course_id, student_id, content) VALUES (?, ?, ?)",
      [courseId, studentId, content]
    );
    res.redirect(`/course/${courseId}`);
  } catch (err) {
    console.error(err);
    res.send("Error posting comment");
  }
};




exports.downloadCertificate = async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.session.user.id;

  try {
    const [[course]] = await db.execute(
      "SELECT title FROM courses WHERE id = ?",
      [courseId]
    );
    const [[student]] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [studentId]
    );

    const [[instructor]] = await db.execute(
      `
      SELECT u.name FROM users u
      JOIN courses c ON u.id = c.instructor_id
      WHERE c.id = ?
    `,
      [courseId]
    );

    if (!course || !student) return res.send("Invalid data");

    const [completionRows] = await db.execute(
      "SELECT * FROM completions WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
    );
    if (completionRows.length === 0)
      return res.send("Complete the course to download your certificate.");

    const doc = new PDFDocument({ size: "A4", layout: "landscape" });

    res.setHeader(
      "Content-disposition",
      `attachment; filename=certificate-${courseId}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fdfdfd");

    // Load logo and center it
    const logoPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "weblogo.png"
    );
    const pageWidth = doc.page.width;

    try {
      doc.image(logoPath, (pageWidth - 100) / 2, 50, { width: 100 });
    } catch (e) {
      console.warn("Logo not found or unsupported image type");
    }

    doc.moveDown(5);

    // Title
    doc.fontSize(28).fillColor("#222").text("Certificate of Completion", {
      align: "center",
    });

    doc.moveDown(1);
    doc.fontSize(18).text(`This certifies that`, { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(24).fillColor("#FFD700").text(`${student.name}`, {
      align: "center",
    });

    doc.moveDown(1);
    doc
      .fillColor("#333")
      .fontSize(18)
      .text(`has successfully completed the course`, {
        align: "center",
      });

    doc.moveDown(0.5);
    doc.fontSize(20).fillColor("#444").text(`${course.title}`, {
      align: "center",
    });

    doc.moveDown(1.5);
    doc
      .fontSize(14)
      .fillColor("#666")
      .text(`Date: ${moment().format("MMMM Do, YYYY")}`, {
        align: "center",
      });

    doc.moveDown(2);
    doc
      .fontSize(16)
      .fillColor("#000")
      .text(" ", { align: "center" });

    // Signature section
    doc.moveDown(5);

    // Position signature at bottom right
    doc
      .fontSize(14)
      .fillColor("#444")
      .text("__________________________", 430, 400, { align: "left" });

    doc.fontSize(12).text(instructor.name || "Course Instructor", 430, 420, {
      align: "left",
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.send("Error generating certificate");
  }
};
