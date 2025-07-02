const path = require("path");

const db = require('./models/db')

const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);


const app = express();

const onlineCourseRouter = require("./routes/online-course");
const authRouter = require('./routes/auth')

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//serving static files
app.use(express.static(path.join(__dirname, "public"))); 

app.use(express.urlencoded({ extended: true })); 

// Session store config
const sessionStore = new MySQLStore({}, db.promise()); // 


//routes
app.use(onlineCourseRouter);
app.use(authRouter);
//session midleware
app.use(
  session({
    key: "user_sid",
    secret: "your_secret_key", 
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);



// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
); 
