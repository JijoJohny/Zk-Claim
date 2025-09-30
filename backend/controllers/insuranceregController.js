const Insurance = require("../models/Insurance");

// Create new insurance record
exports.createInsurance = async (req, res) => {
    try {
        const { did, ageGroup, insurancePlan, sumInsured, coveragePeriod, paymentMethod } = req.body;

        // Check if an insurance record already exists for this DID
        const existingInsurance = await Insurance.findOne({ did });
        if (existingInsurance) {
            return res.status(400).json({ message: "Insurance record already exists for this DID" });
        }

        // Create new insurance entry if not found
        const newInsurance = new Insurance({
            did,
            ageGroup,
            insurancePlan,
            sumInsured,
            coveragePeriod,
            paymentMethod
        });

        await newInsurance.save();
        res.status(201).json({ message: "Insurance record created successfully", data: newInsurance });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all insurance records
exports.getAllInsurance = async (req, res) => {
    try {
        const records = await Insurance.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single insurance record by DID
exports.getInsuranceByDID = async (req, res) => {
    try {
        const record = await Insurance.findOne({ did: req.params.did });
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateDidVerified = async (req, res) => {
    try {
        const { did } = req.params; // Get DID from request parameters
        const { did_verified } = req.body; // Get new verification status from request body

        // Find the insurance record by DID and update the did_verified field
        const updatedInsurance = await Insurance.findOneAndUpdate(
            { did },
            { did_verified },
            { new: true } // Return the updated document
        );

        if (!updatedInsurance) {
            return res.status(404).json({ message: "Insurance record not found" });
        }

        res.status(200).json({ message: "DID verification status updated", data: updatedInsurance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
