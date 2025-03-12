const express = require('express');
const router = express.Router();
const { receiveEHR } = require('../controllers/generateProofController');

// Route for generating proof when button is clicked
router.post('/', receiveEHR);

// Route for retrieving EHR and generating proof using DID


module.exports = router;
