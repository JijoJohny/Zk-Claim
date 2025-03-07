const ClaimRequest = require("../models/ClaimRequest");
const Insurance = require("../models/Insurance");

// Create a new claim request
exports.createClaimRequest = async (req, res) => {
    try {
        const { did, patientName, hospitalName, diagnosis, claimAmount } = req.body;

        // Check if insurance exists for the given DID
        const insurance = await Insurance.findOne({ did });
        if (!insurance) {
            return res.status(404).json({ message: "Insurance record not found" });
        }

        const newClaim = new ClaimRequest({
            did,
            patientName,
            hospitalName,
            diagnosis,
            claimAmount
        });

        await newClaim.save();
        res.status(201).json({ message: "Claim request submitted", data: newClaim });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all claim requests
exports.getAllClaims = async (req, res) => {
    try {
        const claims = await ClaimRequest.find(); // Fetch all claims without populating
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get claims by DID
exports.getClaimsByDID = async (req, res) => {
    try {
        const claims = await ClaimRequest.find({ did: req.params.did });
        if (claims.length === 0) {
            return res.status(404).json({ message: "No claims found for this DID" });
        }
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve or Reject Claim
exports.updateClaimStatus = async (req, res) => {
    try {
        const { status, approved } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const claim = await ClaimRequest.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        claim.claimStatus = status;

        // Update 'approved' only if claim is approved
        if (status === "Approved") {
            claim.approved = true;
        } else {
            claim.approved = false;
        }

        await claim.save();
        res.status(200).json({ message: "Claim status updated", data: claim });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
