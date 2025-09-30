const ClaimRequest = require("../models/ClaimRequest");
const ProofRequest = require("../models/ProofRequest");
const InsuranceCompany = require("../models/InsuranceCompany");
 // Import the model

// Controller function to request proof (POST)
const requestProof = async (req, res) => {
  try {
    const { did, provider, claimId, plan } = req.body; // Extract DID, provider, and claimId from the body

    // Fetch claim request details for the given DID and claimId
    const claimRequest = await ClaimRequest.findOne({ did, _id: claimId });

    if (!claimRequest) {
      return res.status(404).json({ message: "No claim request found for this DID and Claim ID" });
    }

    // Fetch insurance company details using `provider` name
    const insuranceCompany = await InsuranceCompany.findOne({ name: provider });

    if (!insuranceCompany) {
      return res.status(400).json({ message: "Insurance company not found" });
    }

    // Check if a proof request already exists for the same DID and claimId under the same provider
    const existingProofRequest = await ProofRequest.findOne({ 
      did, 
      claimId, 
      companyName: provider 
    });

    if (existingProofRequest) {
      return res.status(409).json({ message: "Proof request already exists for this provider" });
    }

    // Create a new proof request
    const newProofRequest = new ProofRequest({
      did: claimRequest.did,
      claimId: claimRequest._id, // Store claimId
      claimDisease: claimRequest.claimDisease,
      claimAmount: claimRequest.claimAmount,
      hospitalName: claimRequest.hospitalName,
      plan : plan,
      companyName: provider, // Use provider name directly
    });

    // Save proof request to database
    await newProofRequest.save();

    res.status(201).json({ message: "Proof request created successfully", data: newProofRequest });
  } catch (error) {
    console.error("Error creating proof request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get proof request details for a specific DID (GET)
const getProofRequest = async (req, res) => {
  try {
    const { did } = req.params; // Extract DID from request parameters

    // Fetch proof request details for the given DID
    const proofRequest = await ProofRequest.findOne({ did });

    if (!proofRequest) {
      return res.status(404).json({ message: "No proof request found for this DID" });
    }

    res.status(200).json({ message: "Proof request found", data: proofRequest });
  } catch (error) {
    console.error("Error fetching proof request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New Controller function to get all proof requests (GET)
const getAllProofRequests = async (req, res) => {
  try {
    // Fetch all proof requests from the database
    const proofRequests = await ProofRequest.find();

    if (!proofRequests.length) {
      return res.status(404).json({ message: "No proof requests found" });
    }

    res.status(200).json({ message: "All proof requests retrieved", data: proofRequests });
  } catch (error) {
    console.error("Error fetching all proof requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateProof = async (req, res) => {
  try {
    const { proof } = req.body;
    const { id } = req.params; // Extract proof request ID from URL params

    // Validate input
    if (!proof) {
      return res.status(400).json({ message: "Proof is required" });
    }

    // Update only the proof field in the database
    const updated = await ProofRequest.findByIdAndUpdate(
      id,
      { proof }, // Update only proof field
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Proof request not found" });
    }

    res.status(200).json({ message: "Proof updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating proof:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






const updateVerified = async (req, res) => {
  try {
    const { verified,verificationMsg } = req.body; // Extract 'verified' field from body
    const { id } = req.params; // Extract proof request ID from URL params

    // Validate input
    if (verified === undefined || verificationMsg == undefined) {
      return res.status(400).json({ message: "data field is required" });
    }

    // Update only the 'verified' field in the database
    const updated = await ProofRequest.findByIdAndUpdate(
      id,
      { 
        verified, // Update verification status
        verificationMsg // Update verification message
      },
      { new: true } // Return the updated document
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Verified status updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating proof:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Ensure correct import

const updateClaim = async (req, res) => {
  try {
    const { claimStatus, response } = req.body;
    const { id } = req.params;

    // Validate input
    if (!claimStatus || response === undefined) {
      return res.status(400).json({ message: "claimStatus and response are required" });
    }

    // Validate claimStatus against the enum values
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(claimStatus)) {
      return res.status(400).json({ message: "Invalid claimStatus value" });
    }

    // Ensure response is not null
    const updateData = {
      claimStatus,
      response: response || "" // Ensure response is set properly
    };

    // Update claim request
    const updated = await ClaimRequest.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Claim status updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { requestProof, getProofRequest, getAllProofRequests,updateProof,updateVerified,updateClaim };
