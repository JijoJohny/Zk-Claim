const mongoose = require("mongoose");

const proofRequestSchema = new mongoose.Schema({
  did: {
    type: String,
    required: true,
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ClaimRequest",
  },
  claimDisease: {
    type: String,
    required: true,
  },
  claimAmount: {
    type: Number,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  plan: {
    type: String, // Stores the insurance plan type
    required: true, // Ensure it's always provided
  },
  proof: {
    type: String, // Stores a URL, file path, or base64-encoded proof
    default: null,
  },
  verified: {
    type: String,
    enum: ["not verified", "verified"], // Only allows these values
    default: "not verified",
  },
  verificationMsg: {
    type: String, // Stores a custom verification message
    default: null,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const ProofRequest = mongoose.model("ProofRequest", proofRequestSchema);

module.exports = ProofRequest;
