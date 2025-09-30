const InsurancePlan = require("../models/InsurancePlan");

// Fetch all insurance plans
const getPlans = async (req, res) => {
    try {
        const plans = await InsurancePlan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Add a new insurance plan
const addPlan = async (req, res) => {
    try {
        const { provider, plan, amount, coverage, benefits } = req.body;

        // Check if a plan with the same provider and name exists
        const existingPlan = await InsurancePlan.findOne({ provider, plan });
        if (existingPlan) {
            return res.status(400).json({ error: "Plan already exists" });
        }

        const newPlan = new InsurancePlan({ provider, plan, amount, coverage, benefits });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ error: "Failed to add plan" });
    }
};


module.exports = { getPlans, addPlan };
