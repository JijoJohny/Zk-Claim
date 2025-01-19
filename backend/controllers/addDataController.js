const axios = require('axios');
const fs = require('fs');
const os = require('os'); // For cross-platform temp directory
const path = require('path'); // For path manipulation
const API_BASE_URL = 'http://localhost:8000'; // Base URL for Akave API

exports.addUserData = async (req, res) => {
  try {
    const { did, diseases } = req.body;

    // Validate input
    if (!did || !Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({
        message: "Both 'did' and a non-empty 'diseases' array are required.",
      });
    }

    console.log("Received DID:", did);
    console.log("Received diseases array:", diseases);

    let bucketId;

    try {
      // Fetch the existing buckets
      const bucketsResponse = await axios.get(`${API_BASE_URL}/buckets`);
      const buckets = bucketsResponse.data?.data || [];
      const existingBucket = buckets.find(bucket => bucket.Name === did);

      if (existingBucket) {
        bucketId = existingBucket.ID;
        console.log(`Bucket already exists with ID: ${bucketId}`);
      } else {
        console.log('No existing bucket found, creating a new one...');

        const createBucketResponse = await axios.post(
          `${API_BASE_URL}/buckets`,
          { bucketName: did },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log("Response from createBucketResponse:", createBucketResponse?.data);

        if (createBucketResponse?.data?.ID) {
          bucketId = createBucketResponse.data.ID;
          console.log(`Bucket created with ID: ${bucketId}`);
        } else {
          console.error("Failed to extract ID from bucket creation response");
          return res.status(500).json({
            msg: createBucketResponse?.data,
          });
        }
      }
    } catch (error) {
      console.error('Error checking or creating bucket:', error.response?.data || error.message);
      return res.status(500).json({
        message: 'Error checking or creating bucket',
        error: error.response?.data || error.message,
      });
    }

    console.log("BucketId before adding data to the bucket:", bucketId);

    // 1. Convert diseases data to a JSON string
    const jsonData = JSON.stringify(diseases);
    const jsonDataBuffer = Buffer.from(jsonData, 'utf-8');

    // 2. Use system temp directory (cross-platform)
    const tempDir = os.tmpdir(); // Get OS's temp directory
    const tempFilePath = path.join(tempDir, 'diseases.json'); // Create a path for the temp file

    // Ensure the directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write the JSON data to a temporary file
    fs.writeFileSync(tempFilePath, jsonDataBuffer);

    try {
      // Step 1: Start the file upload process
      const fileUploadCreateResponse = await axios.post(
        `${API_BASE_URL}/files-upload-create`,
        { bucketID: bucketId, fileName: 'diseases.json', size: jsonDataBuffer.length },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { streamId } = fileUploadCreateResponse.data;

      console.log("File upload stream ID:", streamId);

      // Step 2: Split data into chunks and upload
      const CHUNK_SIZE = 32 * 1024 * 1024; // 32 MB chunk size
      let start = 0;
      let chunkIndex = 0;

      while (start < jsonDataBuffer.length) {
        const chunkData = jsonDataBuffer.slice(start, start + CHUNK_SIZE);
        const chunkCID = `chunk-${chunkIndex}`; // Generate a chunk identifier

        // Step 3: Upload chunk data
        const fileUploadChunkCreateResponse = await axios.post(
          `${API_BASE_URL}/files-upload-chunk-create`,
          { streamId, chunkCID, size: chunkData.length },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { blocks } = fileUploadChunkCreateResponse.data;
        console.log(`Chunk ${chunkIndex} prepared for upload`);

        // Step 4: Upload each block of the chunk
        for (let block of blocks) {
          await axios.post(`${API_BASE_URL}/files-upload-block`, {
            blockCID: block.cid,
            blockData: chunkData.toString('base64'),
          });
          console.log(`Block ${block.cid} uploaded`);
        }

        // Update start position for the next chunk
        start += CHUNK_SIZE;
        chunkIndex++;
      }

      // Step 5: Commit the file upload once all chunks are uploaded
      const fileUploadCommitResponse = await axios.post(
        `${API_BASE_URL}/files-upload-commit`,
        { streamId, rootCID: 'root-cid-placeholder' }, // Replace with actual root CID after calculating
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("File upload committed:", fileUploadCommitResponse.data);

      // Return success response
      return res.status(201).json({
        message: 'User data added successfully to the bucket!',
        akaveData: fileUploadCommitResponse.data,
      });
    } catch (error) {
      console.error('Error uploading data to the bucket:', error.response?.data || error.message);
      return res.status(500).json({
        message: 'Error uploading data to the bucket',
        error: error.response?.data || error.message,
      });
    } finally {
      // Clean up temporary file
      fs.unlinkSync(tempFilePath);
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
