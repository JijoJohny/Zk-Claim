const express = require("express");
const router = express.Router();
const {
  addInsuranceCompany,
} = require("../controllers/insuranceCompanyController");
router.post("/add", addInsuranceCompany);
module.exports = router;
