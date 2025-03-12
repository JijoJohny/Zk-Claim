const { Web3 } = require("web3");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Web3
const web3 = new Web3(process.env.RPC_URL);

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

// Function to check eligibility
const checkEligibility = async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;
    if (!proof) {
      return res.status(400).json({ success: false, message: "Proof is required." });
    }

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

      return res.status(200).json({
        success: true,
        message,
        publicSignals,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Proof verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { checkEligibility };
