const express = require("express");
const router = express.Router();
const {checkEligibility} = require("../controllers/verifyProofController");
const {downloadAndProcessFile} = require("../controllers/verifyController");

// Define the route for verifying proofs
router.post("/proof", checkEligibility);
router.post("/retrieve", downloadAndProcessFile);

module.exports = router;
