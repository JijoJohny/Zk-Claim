const Insurance = require("../models/Insurance");

// Get all unique users (DIDs)
exports.getUsers = async (req, res) => {
    try {
        const users = await Insurance.find().select("did").distinct("did"); // Get unique DIDs
        res.status(200).json(users.map((did) => ({ did }))); // Return as array of objects
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// Get user details by DID
exports.getUserByDid = async (req, res) => {
    try {
        const { did } = req.params;
        const user = await Insurance.findOne({ did });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user details", error });
    }
};
