const mongoose = require("mongoose");

const ClaimRequestSchema = new mongoose.Schema({
    did: {
        type: String,
        required: true,
        ref: "Insurance"  // Foreign key reference
    },
    hospitalName: { type: String, required: true },
    diagnosis: { type: String, required: true },
    claimAmount: { type: Number, required: true },
    claimStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    approved: {
        type: Boolean,
        default: false
    },
    proof_recieved: {
        type: Boolean,
        default: false
    },
    claimDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("ClaimRequest", ClaimRequestSchema);
