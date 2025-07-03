exports.getIndex = (req, res, next) => {

  console.log(req.session);
  res.render("index", {
    title: "Home",
    isLogin: req.session.user || null,
  });
};

exports.getAllCoures = (req, res, next) => {
  res.render("onlinecourse/course-list", {
    title: 'courses',
    isLogin: req.session.user || null,
  });
};
