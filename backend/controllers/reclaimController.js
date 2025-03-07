const axios = require('axios');
const { generateProof } = require('../services/zkProofService');
const InsuranceCompany = require('../models/InsuranceCompany'); // Model for insurance companies

const AKAVE_API_BASE_URL = 'http://localhost:8000';

exports.receiveEHR = async (req, res) => {
  try {
    const { did } = req.params;
    const { claimDisease, insuranceCompanyId } = req.body;

    console.log(`DID: ${did}, Claim Disease: ${claimDisease}, Insurance Company ID: ${insuranceCompanyId}`);

    if (!did || !claimDisease || !insuranceCompanyId) {
      return res.status(400).json({ success: false, message: "'did', 'claimDisease', and 'insuranceCompanyId' are required." });
    }

    // 1. Verify if the insurance company is registered
    const insuranceCompany = await InsuranceCompany.findOne({ companyId: insuranceCompanyId });

    if (!insuranceCompany) {
      return res.status(403).json({ success: false, message: "Invalid insurance company ID." });
    }

    // 2. Function to download and process EHR file from Akave
    const downloadAndProcess = async (bucketName, fileName) => {
      try {
        const response = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
          responseType: 'arraybuffer',
        });
        console.log(`File downloaded: ${fileName}`);

        const fileContent = Buffer.from(response.data, 'binary').toString('utf8');
        return JSON.parse(fileContent);
      } catch (error) {
        console.error('Error downloading the file:', error.response?.data || error.message);
        throw error;
      }
    };

    let diseases;
    try {
      const bucketDataResponse = await downloadAndProcess(did, 'output.json');
      diseases = bucketDataResponse.diseases || [];
      console.log('Diseases:', diseases);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Patient data not found in Akave.',
        error: error.response?.data || error.message,
      });
    }

    // 4. Check if claimed disease is in the patient's EHR
    const diseaseToClaim = diseases.find(disease => disease.disease_name && disease.disease_name.toLowerCase() === claimDisease.toLowerCase());
    let conditionCode = diseaseToClaim ? 1 : 0;

    // 5. Generate proof
    const inputData = { did, conditionCode };
    console.log('Input data for proof generation:', inputData);

    const proof = await generateProof(inputData);

    // 6. Respond with proof
    res.setHeader('Accept', '*/*');
    return res.status(200).json({ success: true, proof });

  } catch (error) {
    console.error('Error processing EHR or generating proof:', error);
    res.status(500).json({ success: false, message: 'Error processing data', error: error.message });
  }
};

