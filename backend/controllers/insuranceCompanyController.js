const InsuranceCompany = require("../models/InsuranceCompany");
exports.addInsuranceCompany = async (req, res) => {
  try {
    const { name, companyId, contactEmail, phoneNumber, address } = req.body;
    // Check if companyId already exists        const existingCompany = await InsuranceCompany.findOne({ companyId });
    if (existingCompany) {
      return res.status(400).json({ message: "Company ID already exists" });
    }
    // Create new insurance company entry        const newCompany = new InsuranceCompany({ name, companyId, contactEmail, phoneNumber, address });
    await newCompany.save();
    res
      .status(201)
      .json({
        message: "Insurance company added successfully",
        company: newCompany,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
