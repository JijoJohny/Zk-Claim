const mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema({
    did: { type: String, required: true, unique: true }, // Decentralized Identifier
    ageGroup: { type: String, required: true }, // Example: "18-25", "26-40"
    insurancePlan: { type: String, required: true }, // Example: "Basic", "Premium"
    sumInsured: { type: String, required: true }, // Example: "$10,000 - $50,000"
    coveragePeriod: { type: String, required: true }, // Example: "1 year", "5 years"
    paymentMethod: { type: String, required: true }, // Example: "Credit Card", "Crypto"
    did_verified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Insurance", InsuranceSchema);
