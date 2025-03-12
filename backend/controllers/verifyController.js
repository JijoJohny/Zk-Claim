const { Web3 } = require("web3");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const web3 = new Web3(process.env.RPC_URL);
const API_BASE_URL = "http://localhost:8000"; // Base URL for Akave API

// Load contract ABI and address
const contractABI = require("./contractABI.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create the contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Helper to format the proof
const formatProof = (proof) => ({
  pi_a: [proof.pi_a[0], proof.pi_a[1]],
  pi_b: [
    [proof.pi_b[0][0], proof.pi_b[0][1]],
    [proof.pi_b[1][0], proof.pi_b[1][1]],
  ],
  pi_c: [proof.pi_c[0], proof.pi_c[1]],
});

// **Moved checkEligibility above**
const checkEligibility2 = async (jsonData) => {
  try {
    if (!jsonData || !jsonData.proof) {
      return { success: false, message: "Proof is required." };
    }

    const { proof, publicSignals } = jsonData;
    const formattedProof = formatProof(proof);
    const { pi_a, pi_b, pi_c } = formattedProof;

    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    // Prepare transaction
    const tx = contract.methods.verifyProof(pi_a, pi_b, pi_c, publicSignals);
    const gasEstimate = await tx.estimateGas({ from: account.address });
    const txData = {
      from: account.address,
      to: contractAddress,
      data: tx.encodeABI(),
      gas: gasEstimate,
      gasPrice: await web3.eth.getGasPrice(),
    };

    // Sign and send transaction
    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    if (receipt.status) {
      const isEligible = parseInt(publicSignals[0], 10) > 0; // Example eligibility condition
      const message = isEligible
        ? "Eligible for insurance claim"
        : "Not eligible for insurance claim";

      return {
        success: true,
        message,
        publicSignals,
      };
    } else {
      return {
        success: false,
        message: "Proof verification failed",
      };
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
};

exports.downloadAndProcessFile = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "'requestId' (bucket name) is required in the request body." });
    }

    // Step 1: Fetch the list of files in the bucket
    const fileListResponse = await axios.get(`${API_BASE_URL}/buckets/${requestId}/files`);
    if (!fileListResponse.data.success || !Array.isArray(fileListResponse.data.data)) {
      return res.status(400).json({ message: "Invalid response from the server when fetching file list." });
    }

    const files = fileListResponse.data.data; // Extract file list
    const fileDetails = [];

    // Function to download and process each file
    const downloadAndProcess = async (bucketName, fileName) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
          responseType: "arraybuffer",
        });

        const fileContent = Buffer.from(response.data, "binary").toString("utf8");
        const jsonData = JSON.parse(fileContent);
        return { fileName, data: jsonData };
      } catch (error) {
        console.error(`Error downloading file: ${fileName}`, error.response?.data || error.message);
        return { fileName, error: "Failed to download or process file." };
      }
    };

    // Step 2: Download and process each file
    for (const file of files) {
      const fileData = await downloadAndProcess(requestId, file.Name);
      fileDetails.push(fileData.data);
    }

    const input = fileDetails[0];

    // **Capture the result of checkEligibility and return it**
    const eligibilityResult = await checkEligibility2(input);
    return res.status(200).json(eligibilityResult);
  } catch (error) {
    console.error("Error fetching or processing files:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

