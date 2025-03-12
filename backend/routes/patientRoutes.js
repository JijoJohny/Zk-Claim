const express = require("express");
const { getAllPatientDIDs } = require("../controllers/patientController");

const router = express.Router();

router.get("/dids", getAllPatientDIDs); // Endpoint to fetch patient DIDs

module.exports = router;
