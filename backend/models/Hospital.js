const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hospitalId: { type: String, required: true, unique: true, uppercase: true },
  contactEmail: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{10}$/ 
  },
  address: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }})

module.exports = mongoose.model("Hospital", HospitalSchema);
