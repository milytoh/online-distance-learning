const db = require('./db')

const bcrypt = require("bcryptjs");

class User {
  constructor(fullname, email, roll, password) {
    this.fullname = fullname;
    this.email = email;
    this.roll = roll;
    this.password = password;
  }

  async signup() {
    const hashedPwd = await bcrypt.hash(this.password, 12);

    try {
      const userData = await db.execute(
        "INSERT INTO users (name, email, pass word, role) VALUES (?, ?, ?, ?)",
        [this.fullname, this.email, hashedPwd, this.role]
      );

      return userData;
      //  res.redirect("/login");
    } catch (err) {
      console.error(err);
      throw("Error creating account. Try another email.");
    }
  }
}

module.exports = User;
