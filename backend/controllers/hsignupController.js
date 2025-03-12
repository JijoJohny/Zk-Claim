const Hospital = require("../models/Hospital");
//const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { name, contactEmail, phoneNumber, password, address } = req.body;

    console.log("📝 Request received:", req.body); // Debugging log

    // Validate input
    if (!name || !contactEmail || !phoneNumber || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or phone already exists
    const existinghospital = await Hospital.findOne({ 
      $or: [{ contactEmail }, { phoneNumber }] 
    });

    if (existinghospital) {
      return res.status(400).json({ message: "Email or phone number already registered" });
    }

    // Generate unique hospital ID
    let hospitalId;
    let isUnique = false;

    while (!isUnique) {
      hospitalId = "H" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const existingId = await Hospital.findOne({ hospitalId });
      if (!existingId) isUnique = true;
    }

    // Hash password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create new insurance hospital
    const newHospital = new Hospital({
      hospitalId,
      name,
      contactEmail,
      phoneNumber,
      address,
      password,
    });

    await newHospital.save();
    res.status(201).json({ message: "Signup successful!", hospitalId });
  } catch (error) {
    console.error("❌ Signup error:", error); // Debugging log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
