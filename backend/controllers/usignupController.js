const Patient = require("../models/Patient");

exports.signup = async (req, res) => {
  try {
    const { email, password, cpassword, did } = req.body;

    console.log("📝 Request received:", req.body); // Debugging log

    // Validate input
    if (!email || !password || !cpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== cpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new patient object (No Hashing)
    const newPatient = new Patient({
      email,
      password, // **Stored as plain text (not recommended for production)**
      ...(did && { did }) // Include `did` only if provided
    });

    await newPatient.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("❌ Signup error:", error); // Debugging log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
