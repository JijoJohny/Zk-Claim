const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital'); // Your Hospital model
const bcrypt = require('bcrypt');

// Handle Hospital Signup
router.post('/hospital-signup', async (req, res) => {
  try {
    const {
      hospitalName, registrationNumber, accreditation, address, city, state, zipCode,
      adminName, designation, email, phone, password
    } = req.body;

    // Check if email already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new hospital document
    const newHospital = new Hospital({
      hospitalName,
      registrationNumber,
      accreditation,
      address,
      city,
      state,
      zipCode,
      adminName,
      designation,
      email,
      phone,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Optional, since confirmPassword is just used for validation
    });

    // Save the hospital data to the database
    await newHospital.save();

    res.status(201).json({ message: "Hospital successfully registered." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
