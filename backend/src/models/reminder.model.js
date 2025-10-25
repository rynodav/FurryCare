const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true, index: true },
    title: { type: String, required: true, trim: true },
    dueAt: { type: Date, required: true, index: true },
    frequency: { type: String, enum: ['once', 'daily', 'weekly', 'monthly'], default: 'once' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// helpful compound index for queries by pet & due date
reminderSchema.index({ petId: 1, dueAt: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
