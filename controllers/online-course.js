exports.getIndex = (req, res, next) => {
  res.render("index", {
    title: "Home",
  });
};

exports.getAllCoures = (req, res, next) => {
  res.render("onlinecourse/course-list", {});
};
