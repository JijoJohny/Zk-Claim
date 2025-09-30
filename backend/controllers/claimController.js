const ClaimRequests = require("../models/ClaimRequest");
const Insurance = require("../models/Insurance");

// Create a new claim request
exports.createClaimRequest = async (req, res) => {
    try {
        const { did, insuranceId, hospitalName, claimDisease, claimAmount } = req.body;

        // Check if the insurance record exists
        const insurance = await Insurance.findOne({ _id: insuranceId, did });
        if (!insurance) {
            return res.status(404).json({ message: "Insurance record not found" });
        }

        // Check if there is an existing Pending/Approved claim for this DID and insuranceId
        const existingClaim = await ClaimRequests.findOne({
            did,
            insuranceId,
            claimStatus: { $in: ["Pending", "Approved"] }
        });

        if (existingClaim) {
            return res.status(400).json({
                message: "A claim is already submitted or approved for this insurance."
            });
        }

        // Create a new claim request
        const newClaim = new ClaimRequests({
            did,
            insuranceId,
            hospitalName,
            claimDisease,
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
        const claims = await ClaimRequests.find(); // Fetch all claims
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get claims by DID
exports.getClaimsByDID = async (req, res) => {
    try {
        const claims = await ClaimRequests.find({ did: req.params.did });
        if (claims.length === 0) {
            return res.status(404).json({ message: "No claims found for this DID" });
        }
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update claim status (Approve/Reject)
exports.updateClaimStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const claim = await ClaimRequests.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        claim.claimStatus = status;
        claim.approved = status === "Approved";

        await claim.save();
        res.status(200).json({ message: "Claim status updated", data: claim });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
