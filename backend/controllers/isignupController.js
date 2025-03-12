const InsuranceCompany = require("../models/InsuranceCompany");
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
    const existingCompany = await InsuranceCompany.findOne({ 
      $or: [{ contactEmail }, { phoneNumber }] 
    });

    if (existingCompany) {
      return res.status(400).json({ message: "Email or phone number already registered" });
    }

    // Generate unique company ID
    let companyId;
    let isUnique = false;

    while (!isUnique) {
      companyId = "I" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const existingId = await InsuranceCompany.findOne({ companyId });
      if (!existingId) isUnique = true;
    }

    // Hash password before saving
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create new insurance company
    const newCompany = new InsuranceCompany({
      companyId,
      name,
      contactEmail,
      phoneNumber,
      address,
      password,
    });

    await newCompany.save();
    res.status(201).json({ message: "Signup successful!", companyId });
  } catch (error) {
    console.error("❌ Signup error:", error); // Debugging log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
