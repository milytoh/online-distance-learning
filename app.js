const path = require("path");

const db = require("./models/db");

const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const flash = require("connect-flash");

const app = express();

const onlineCourseRouter = require("./routes/online-course");
const authRouter = require("./routes/auth");
const instructorRouter = require("./routes/instructor");

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

// Session store config
const sessionStore = new MySQLStore({}, db); //

//session midleware
app.use(
  session({
    key: "user_sid",
    secret:
      "4d8f2a8304b1c19ab4b8a87497f0cd87ee8d6a7a0a2cfb6dd0e41d6dd66a34dc...",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Flash middleware
app.use(flash());



//routes
app.use(onlineCourseRouter);
app.use(authRouter);
app.use(instructorRouter);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
 