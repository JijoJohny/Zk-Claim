const mongoose = require('mongoose');

const InsurancePlanSchema = new mongoose.Schema({
     // Auto-generated unique ID
    provider: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    coverage: { type: Number, required: true },
    benefits: { type: [String], required: true } // List of benefits
});

const InsurancePlan = mongoose.model('InsurancePlan', InsurancePlanSchema);

module.exports = InsurancePlan;
