const mysql = require("mysql2/promise");

// Create the pool
const pool = mysql.createPool({
  connectionLimit: 20,
  user: "root",
  password: "milytoh",
  database: "distance_learning",
});

module.exports = pool;
