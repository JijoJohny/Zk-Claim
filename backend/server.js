const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const ehrRoutes = require('./routes/ehrRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const reclaimRoutes = require('./routes/reclaimRoutes');
const insuranceRoutes = require("./routes/insuranceRoutes");
const claimRoutes = require("./routes/claimRoutes");
const isignupRoutes = require("./routes/isignupRoutes"); 
const hsignupRoutes = require("./routes/hsignupRoutes"); 
const authRoutes = require("./routes/authRoutes");
const dbRoutes=  require("./routes/dbRoutes.js");
const iplanRoutes = require("./routes/iplanRoutes");
const retrieveRoutes = require("./routes/retrieveRoutes");
const usignupRoutes = require("./routes/usignupRoutes"); 
const proofRequestRoutes = require("./routes/proofRequestRoutes"); 
const patientRoutes = require("./routes/patientRoutes.js");
const generateProofRoutes = require("./routes/generateProofRoutes.js");
const verifyProofRoutes = require('./routes/verifyProofRoutes');
dotenv.config();

const app = express();
const port = process.env.PORT || 5001; // Ensure correct port

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Insurance verification API is running');
});

// signup routes
app.use('/api/insurance', isignupRoutes);
app.use('/api/hospital', hsignupRoutes);
app.use('/api/patient', usignupRoutes);
app.use("/api/auth", authRoutes); //login
app.use('/api/data', ehrRoutes); //add data to akave
app.use("/api/insurance", insuranceRoutes); //insurance purchase 
app.use('/api/claims', claimRoutes); //insurance claim
app.use('/api/proof-req',proofRequestRoutes);//proof request
app.use('/api/generate-proof',generateProofRoutes);//proof generation and file upload
app.use('/api/verify', verifyProofRoutes); //file retrieval and verification
app.use("/api/plans", iplanRoutes); //insurance plans
app.use('/api/patients',patientRoutes);//to list all patients
app.use("/api/db", dbRoutes); //db management
app.use("/api/retrieve", retrieveRoutes);//akave file content retrieval

app.use('/api/reclaim', reclaimRoutes);//proof generation(old)
app.use('/api/verify', verifyRoutes);//proof verification(old)

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
