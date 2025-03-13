const express = require("express");
const { getPlans, addPlan } = require("../controllers/iplanController");

const router = express.Router();

router.get("/", getPlans);  // Fetch all plans
router.post("/", addPlan);  // Add a new plan

module.exports = router;
