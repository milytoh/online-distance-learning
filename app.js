const path = require("path");

const express = require("express");
const app = express();

const onlineCourseRouter = require("./routes/online-course");

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//serving static files
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(onlineCourseRouter);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
); 
