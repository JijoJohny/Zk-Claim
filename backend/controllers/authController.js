const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");
const InsuranceCompany = require("../models/InsuranceCompany");

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let user;
    let companyName = "";
    let did = ""; // Default empty company name

    if (role === "patient") {
      user = await Patient.findOne({ email });
      if(user){
        did = user.did; 
      }
    } else if (role === "hospital") {
      user = await Hospital.findOne({ contactEmail : email });
    } else if (role === "insurance") {
      user = await InsuranceCompany.findOne({ contactEmail: email });
      if (user) {
        companyName = user.name || "Unknown Insurance"; // Retrieve companyName if available
      }
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful", role, companyName, did });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { login };
