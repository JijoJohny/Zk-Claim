const Patient = require("../models/Patient"); // Import the Patient model

// Retrieve all patients' DIDs
const getAllPatientDIDs = async (req, res) => {
  try {
    const patients = await Patient.find({}, "did"); // Fetch only the 'did' field
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error retrieving patient DIDs:", error);
    res.status(500).json({ message: "Server error while fetching patient DIDs" });
  }
};

module.exports = { getAllPatientDIDs };
