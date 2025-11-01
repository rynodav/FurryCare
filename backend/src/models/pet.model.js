// Import Mongoose to define schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the Pet schema (structure of a Pet document in MongoDB)
const petSchema = new mongoose.Schema(
  {
    // Required name for the pet — trimmed to remove extra spaces
    name: { type: String, required: true, trim: true },

    // Required type/category of pet, e.g., Dog, Cat — also trimmed
    type: { type: String, required: true, trim: true },

    // Optional breed information — trimmed string
    breed: { type: String, trim: true },

    // Optional date of birth for the pet
    birthDate: { type: Date },
  },

  // Automatically adds createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the model — creates a "pets" collection in MongoDB
module.exports = mongoose.model('Pet', petSchema);
