const mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema({
    did: { type: String, required: true, ref: "Patient" }, // Reference to Patient's DID
    planId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "InsurancePlan" }, // Reference to the Plan
    plan: { type: String, required: true }, // Plan Name
    provider: { type: String, required: true }, // Provider Name
    purchaseDate: { type: Date, default: Date.now }, // Purchase timestamp
    claim: { 
        type: String, 
        enum: ["no", "pending", "approved", "rejected"], 
        default: "no" 
    } // Claim status with predefined values
});

module.exports = mongoose.model("Insurance", InsuranceSchema);
