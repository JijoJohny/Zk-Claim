const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route to get all unique users
router.get("/users", userController.getUsers);

// Route to get a single user by DID
router.get("/users/:did", userController.getUserByDid);

module.exports = router;
