const Insurance = require("../models/Insurance");

// Purchase Insurance
const purchaseInsurance = async (req, res) => {
    try {
        const { did, planId, plan, provider } = req.body;

        // Check if the patient already has this plan
        const existingInsurance = await Insurance.findOne({ did, planId });
        if (existingInsurance) {
            return res.status(400).json({ message: "You have already purchased this insurance plan." });
        }

        // Save new insurance purchase
        const newPurchase = new Insurance({ did, planId, plan, provider });
        await newPurchase.save();

        res.status(201).json({ message: "Insurance Purchased Successfully", purchase: newPurchase });
    } catch (error) {
        res.status(500).json({ message: "Error purchasing insurance", error });
    }
};


// Get All Insurances
const getAllInsurances = async (req, res) => {
    try {
        const insurances = await Insurance.find();
        res.status(200).json(insurances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching insurances", error });
    }
};

// Get Insurance by Patient DID
const getPatientInsurances = async (req, res) => {
    try {
        const { did } = req.params;
        const insurances = await Insurance.find({ did });

        if (!insurances.length) {
            return res.status(404).json({ message: "No insurance found for this DID" });
        }

        res.status(200).json(insurances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching insurances", error });
    }
};

// Delete Insurance (if needed)
// Delete Insurance (by ID and DID)
const deleteInsurance = async (req, res) => {
    try {
        const { id } = req.params;  // Insurance record ID
        const { did } = req.body;   // DID from request body

        // Ensure both ID and DID are provided
        if (!did) {
            return res.status(400).json({ message: "DID is required for deletion" });
        }

        // Find the insurance by ID and DID
        const deletedInsurance = await Insurance.findOneAndDelete({ _id: id, did });

        if (!deletedInsurance) {
            return res.status(404).json({ message: "No matching insurance found for this DID" });
        }

        res.status(200).json({ message: "Insurance deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting insurance", error });
    }
};


module.exports = {
    purchaseInsurance,
    getAllInsurances,
    getPatientInsurances,
    deleteInsurance
};
