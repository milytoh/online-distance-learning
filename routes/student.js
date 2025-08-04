const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");
const { auth } = require("../middleware/auth");

// Ensure student is logged in
router.get("/student/dashboard", studentController.dashboard);

module.exports = router;
