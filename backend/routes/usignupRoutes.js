const express = require("express");
const { signup } = require("../controllers/usignupController");

const router = express.Router();

// Ensure Correct Route Path
router.post("/signup", signup); 

module.exports = router;
