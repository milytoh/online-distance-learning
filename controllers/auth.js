const bcrypt = require('bcryptjs')

const db = require("../models/db");
const User = require('../models/user')

exports.getSignup = (req, res, next) => {
  console.log("hhhh");
  res.render("auth/signup", {
    title: "Signup",
  });
};

exports.postSignup = async(req, res, next) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  // const user = new User(fullname, email, role, password);

  // const userData =  user.signup();

  const hashedPwd = await bcrypt.hash(password, 12);

    try {
      await db.execute(
        "INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
        [fullname, email, role, hashedPwd]
      );

      console.log('user crea')
      // res.redirect("/login");
    } catch (err) {
      console.error(err);
      res.send("Error creating account. Try another email.");
    }

};
