const bcrypt = require("bcryptjs");

const db = require("../models/db");
const User = require("../models/user");

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    title: "Signup",
    isLogin: req.session.user,
  });
};

exports.postSignup = async (req, res, next) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  const hashedPwd = await bcrypt.hash(password, 12);

  try {
    await db.execute(
      "INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
      [fullname, email, role, hashedPwd]
    );

    console.log("user crea");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Error creating account. Try another email.");
  }
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    title: "Login",
    isLogin: req.session.user,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    console.log(rows);
    const user = rows[0];

    if (!user) {
      return res.render("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "invalid email or password");
      return res.redirect("/login");
    }

    // Set session'
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    req.flash("success", "Login successful!");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Login failed");
  }
};

exports.getLogout = (req, res, next) => {
  // Set flash first (before session is destroyed)
  req.flash("success", "You have been logged out");

  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      req.flash("error", "Logout failed");
      return res.redirect("/");
    }

    res.clearCookie("user_sid");
    res.redirect("/login");
  });
};
