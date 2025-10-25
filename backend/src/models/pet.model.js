const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, // e.g. Dog, Cat
    breed: { type: String, trim: true },
    birthDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
