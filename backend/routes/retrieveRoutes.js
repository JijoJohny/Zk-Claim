const express = require('express');
const router = express.Router();
const { downloadAndProcessFile } = require('../controllers/retrieve');  // Import from the correct path

// POST route for retrieving data
router.post('/retrieve', downloadAndProcessFile);

module.exports = router;
