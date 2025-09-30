const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");

// Routes
router.post("/", claimController.createClaimRequest);
router.get("/", claimController.getAllClaims);
router.get("/:did", claimController.getClaimsByDID);
router.patch("/:id/status", claimController.updateClaimStatus);

module.exports = router;
