const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/insuranceregController");

// Routes
router.post("/", insuranceController.createInsurance);
router.get("/", insuranceController.getAllInsurance);
router.get("/:did", insuranceController.getInsuranceByDID);
router.put("/update-did-verified/:did", insuranceController.updateDidVerified);

module.exports = router;
