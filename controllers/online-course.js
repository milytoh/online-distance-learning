const db = require('../models/db')

exports.getIndex = async(req, res, next) => {

  console.log(req.session);
  res.render("index", {
    title: "Home",
    isLogin: req.session.user || null,
  });
};

exports.getAllCoures = async(req, res, next) => {
  try {
    // Fetch all courses + instructor name
    const [courses] = await db.execute(`
      SELECT c.*, u.name AS instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
    `);

    res.render('onlinecourse/course-list', {
      title: 'Student Dashboard',
      user: req.session.user,
      courses,
      isLogin: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.send('Error loading courses');
  }
};
