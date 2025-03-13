const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  did: { type: String, default: "" } // DID can be added later
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);
