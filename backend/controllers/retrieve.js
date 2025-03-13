const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000'; // Base URL for Akave API

exports.downloadAndProcessFile = async (req, res) => {
  try {
    const { did } = req.body;

    // Validate input
    if (!did) {
      return res.status(400).json({
        message: "'did' (bucket name) is required in the request body.",
      });
    }

    // Step 1: Fetch the list of files in the bucket
    const fileListResponse = await axios.get(`${API_BASE_URL}/buckets/${did}/files`);

    if (!fileListResponse.data.success || !Array.isArray(fileListResponse.data.data)) {
      return res.status(400).json({ message: 'Invalid response from the server when fetching file list.' });
    }

    const files = fileListResponse.data.data; // Extract file list
    const fileDetails = [];

    // Function to download and process each file
    const downloadAndProcess = async (bucketName, fileName) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
          responseType: 'arraybuffer', // Fetch binary data
        });

        // Convert buffer data to a UTF-8 string
        const fileContent = Buffer.from(response.data, 'binary').toString('utf8'); 
        const jsonData = JSON.parse(fileContent); // Parse JSON data

        return { fileName, data: jsonData }; // Return processed file data
      } catch (error) {
        console.error(`Error downloading file: ${fileName}`, error.response?.data || error.message);
        return { fileName, error: 'Failed to download or process file.' };
      }
    };

    // Step 2: Download and process each file
    for (const file of files) {
      const fileData = await downloadAndProcess(did, file.Name);
      fileDetails.push(fileData);
    }

    return res.status(200).json({
      message: 'All files processed successfully.',
      files: fileDetails,
    });

  } catch (error) {
    console.error('Error fetching or processing files:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
