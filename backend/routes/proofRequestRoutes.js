const express = require("express");
const router = express.Router();
const { 
  requestProof, 
  getProofRequest, 
  getAllProofRequests, 
  updateProof, updateVerified,updateClaim, // Import updateProof function
} = require("../controllers/proofRequestController");

// POST route to handle proof request creation
router.post("/", requestProof);

// GET route to fetch all proof requests
router.get("/", getAllProofRequests); 

// GET route to fetch proof request details by DID
router.get("/:did", getProofRequest);

// PATCH route to update the proof field only
router.patch("/:id", updateProof);

router.patch("/verified/:id", updateVerified);

router.patch("/update-claim/:id", updateClaim);

module.exports = router;
