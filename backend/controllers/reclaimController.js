const axios = require('axios');
const { generateProof } = require('../services/zkProofService');

const AKAVE_API_BASE_URL = 'http://localhost:8000';

exports.receiveEHR = async (req, res) => {
  try {
    const { did } = req.params;
    const { claimDisease } = req.body;

    console.log("DID:", did, "Claim Disease:", claimDisease);

    if (!did || !claimDisease) {
      return res.status(400).json({ success: false, message: "'did' and 'claimDisease' are required." });
    }

    // Function to download and process a single file
    const downloadAndProcessFile = async (bucketName, fileName) => {
      try {
        console.log(`Attempting to download file: ${fileName}`);
        const response = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
          responseType: 'arraybuffer',
        });

        console.log(`File successfully downloaded: ${fileName}`);
        const fileContent = Buffer.from(response.data, 'binary').toString('utf8');
        const jsonData = JSON.parse(fileContent);

        console.log(`Parsed JSON for file ${fileName}:`, jsonData);
        return jsonData;
      } catch (error) {
        console.error(`Error downloading file ${fileName}:`, error.response?.data || error.message);
        return null;
      }
    };

    // Step 1: Get all files in the DID bucket
    let filesList;
    try {
      console.log(`Fetching file list for bucket: ${did}`);
      const listResponse = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${did}/files`);
      filesList = listResponse.data.data || [];

      console.log("Files found in bucket:", filesList.map(f => f.Name));
    } catch (error) {
      console.error('Error retrieving file list from Akave:', error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving file list from Akave',
        error: error.response?.data || error.message,
      });
    }

    if (filesList.length === 0) {
      console.log("No files found in bucket!");
      return res.status(404).json({ success: false, message: "No files found in Akave for this DID" });
    }

    // Step 2: Process each file in the bucket
    let allDiseases = [];
    for (const file of filesList) {
      const fileName = file.Name;
      console.log(`Processing file: ${fileName}`);

      const jsonData = await downloadAndProcessFile(did, fileName);
      if (jsonData) {
        console.log(`File ${fileName} contains diseases field?`, jsonData.hasOwnProperty('diseases'));

        if (jsonData.diseases && Array.isArray(jsonData.diseases)) {
          allDiseases = allDiseases.concat(jsonData.diseases);
        } else {
          console.log(`Skipping file ${fileName} as it doesn't contain a valid diseases field.`);
        }
      }
    }

    console.log("Aggregated Diseases List:", allDiseases);

    // Step 3: Check for the claimed disease
    const diseaseToClaim = allDiseases.find(disease =>
      disease.disease_name && disease.disease_name.toLowerCase() === claimDisease.toLowerCase()
    );

    let conditionCode = 0;
    if (diseaseToClaim) {
      conditionCode = 1;
    }

    console.log("Final Condition Code:", conditionCode);

    const inputData = {
      did,
      conditionCode,
    };

    console.log('Input data for proof generation:', inputData);

    // Step 4: Generate the proof
    const proof = await generateProof(inputData);

    res.setHeader('Accept', '*/*');
    return res.status(200).json({ success: true, proof });
  } catch (error) {
    console.error('Error processing EHR or generating proof:', error);
    res.status(500).json({ success: false, message: 'Error processing data', error: error.message });
  }
};
