const express = require("express");
const { getAllCollections } = require("../controllers/dbController");

const router = express.Router();

router.get("/all-collections", getAllCollections);

module.exports = router; // ✅ Ensure module.exports is used
