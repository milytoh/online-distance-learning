const pool = require("../models/db");

exports.getSignup = (req, res, next) => {
  console.log("hhhh");
  res.render("auth/signup", {
    title: "Signup",
  });
};

exports.postSignup = (req, res, next) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;

  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // res.json(results);
    console.log(results);
  });

  
};
