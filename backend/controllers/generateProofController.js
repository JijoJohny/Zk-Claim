const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { generateProof } = require('../services/zkProofService');

const AKAVE_API_BASE_URL = 'http://localhost:8000';

exports.receiveEHR = async (req, res) => {
  try {
    const { did, claimDisease, requestId } = req.body;

    if (!did || !claimDisease) {
      return res.status(400).json({ success: false, message: "'did' and 'claimDisease' are required." });
    }

    const downloadAndProcess = async (bucketName, fileName) => {
      try {
        const response = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
          responseType: 'arraybuffer',
        });
        const fileContent = Buffer.from(response.data, 'binary').toString('utf8');
        return JSON.parse(fileContent);
      } catch (error) {
        console.error('Error downloading the file:', error.response?.data || error.message);
        throw error;
      }
    };

    let diseases = [];
    try {
      const fileListResponse = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${did}/files`);
      if (fileListResponse.data.success && Array.isArray(fileListResponse.data.data)) {
        for (const file of fileListResponse.data.data) {
          try {
            const fileData = await downloadAndProcess(did, file.Name);
            if (fileData.diseases) {
              diseases = diseases.concat(fileData.diseases);
            }
          } catch (error) {
            console.error(`Failed to process file ${file.Name}:`, error.message);
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error retrieving data from Akave', error: error.message });
    }

    const diseaseToClaim = diseases.find(d => d.disease_name?.toLowerCase() === claimDisease.toLowerCase());
    const conditionCode = diseaseToClaim ? 1 : 0;

    const inputData = { did, conditionCode };
    const proof = await generateProof(inputData);
    
    // Save proof to a JSON file
    const proofFilePath = path.join(__dirname, 'files', 'proof.json');
    fs.writeFileSync(proofFilePath, JSON.stringify(proof, null, 2));

    // Upload proof.json to Akave
    const uploadFile = async (bucketName, filePath) => {
      try {
        const bucketsResponse = await axios.get(`${AKAVE_API_BASE_URL}/buckets`);
        const buckets = bucketsResponse.data?.data || [];
        const existingBucket = buckets.find(bucket => bucket.Name === bucketName);

        if (!existingBucket) {
          await axios.post(
            `${AKAVE_API_BASE_URL}/buckets`,
            { bucketName },
            { headers: { 'Content-Type': 'application/json' } }
          );
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        await axios.post(`${AKAVE_API_BASE_URL}/buckets/${bucketName}/files`, form, {
          headers: form.getHeaders(),
        });
      } catch (error) {
        console.error('Failed to upload file:', error.response?.data || error.message);
        throw error;
      }
    };

    try {
      await uploadFile(requestId, proofFilePath);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Proof upload failed', error: error.message });
    }

    return res.status(200).json({ success: true, message: 'Proof generated and uploaded successfully', proof });
  } catch (error) {
    console.error('Error processing EHR or generating proof:', error);
    res.status(500).json({ success: false, message: 'Error processing data', error: error.message });
  }
};
