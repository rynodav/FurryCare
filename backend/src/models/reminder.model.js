// Import Mongoose to define schema and interact with MongoDB
const mongoose = require('mongoose');

// Define the Reminder schema (structure of reminders stored in MongoDB)
const reminderSchema = new mongoose.Schema(
  {
    // Reference to the associated Pet document (foreign key relationship)
    // indexed for faster queries by pet
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true, index: true },

    // Reminder title or description
    title: { type: String, required: true, trim: true },

    // Date/time when the reminder is due — indexed to sort/filter upcoming reminders
    dueAt: { type: Date, required: true, index: true },

    // How often the reminder repeats (if at all)
    frequency: { type: String, enum: ['once', 'daily', 'weekly', 'monthly'], default: 'once' },

    // Mark when a reminder has been completed/handled
    completed: { type: Boolean, default: false },
  },

  // Automatically includes createdAt and updatedAt timestamps
  { timestamps: true }
);

// Add a compound index to speed up queries by both petId and due date
reminderSchema.index({ petId: 1, dueAt: 1 });

// Export model — creates a "reminders" collection in MongoDB
module.exports = mongoose.model('Reminder', reminderSchema);
