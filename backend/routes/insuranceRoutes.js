const express = require("express");
const { purchaseInsurance, getAllInsurances, getPatientInsurances, deleteInsurance } = require("../controllers/insuranceController");

const router = express.Router();

router.post("/purchase", purchaseInsurance);  // Purchase insurance
router.get("/", getAllInsurances);           // Get all insurance records
router.get("/:did", getPatientInsurances);   // Get insurance by patient DID
router.delete("/:id", deleteInsurance);      // Delete insurance by ID

module.exports = router;

