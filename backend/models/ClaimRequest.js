const mongoose = require("mongoose");

const ClaimRequestsSchema = new mongoose.Schema({
    did: {
        type: String,
        required: true,
        ref: "Insurance"  // Foreign key reference to Insurance
    },
    insuranceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Insurance",
        required: true
    },
    hospitalName: { 
        type: String, 
        required: true 
    },
    claimDisease: {  // Updated field name
        type: String, 
        required: true 
    },
    claimAmount: { 
        type: Number, 
        required: true 
    },
    claimStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    response: { 
        type: String,
        default: ""
    },
    claimDate: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model("ClaimRequests", ClaimRequestsSchema);
