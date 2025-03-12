const mongoose = require("mongoose");

const getAllCollections = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const data = {};

    for (const collection of collections) {
      const modelName = collection.name;
      const collectionData = await mongoose.connection.db.collection(modelName).find({}).toArray();
      data[modelName] = collectionData;
    }

    res.json({ collections: data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving collections", error: error.message });
  }
};

module.exports = { getAllCollections }; // ✅ Ensure module.exports is used
