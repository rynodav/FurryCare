// Wraps async route handlers and forwards errors to Express error middleware
const asyncHandler = require('../middleware/async');
// Mongoose utilities (ObjectId validation, etc.)
const mongoose = require('mongoose');
// Models (MongoDB collections)
const Pet = require('../models/pet.model');
const Reminder = require('../models/reminder.model');

/**
 * GET /api/reminders
 * (or /api/pets/:petId/reminders if nested routing is used)
 *
 * Returns all reminders, optionally filtered by petId.
 * 200: list of reminders sorted by due date
 * 400: invalid petId
 */
exports.listReminders = asyncHandler(async (req, res) => {
  // Accept petId from route params OR query string
  const petId = req.params.petId || req.query.petId;
  const filter = {};

  // Filter reminders by pet if a petId is provided
  if (petId) {
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(400).json({ error: 'Invalid petId' });
    }
    filter.petId = petId;
  }

  // Sort by due date ascending
  const reminders = await Reminder.find(filter).sort({ dueAt: 1 }).lean();
  res.json(reminders);
});

/**
 * GET /api/reminders/:reminderId
 *
 * Returns a single reminder by id.
 * 200: reminder data
 * 400: invalid id
 * 404: reminder not found
 */
exports.getReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;

  // Validate id before querying DB
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ error: 'Invalid reminderId' });
  }

  const r = await Reminder.findById(reminderId).lean();
  if (!r) return res.status(404).json({ error: 'Reminder not found' });

  res.json(r);
});

/**
 * POST /api/reminders
 *
 * Creates a new reminder.
 * Required fields: petId, title, dueAt
 * frequency defaults to 'once'
 * 201: created reminder
 * 400: missing field / invalid petId / invalid date
 */
exports.createReminder = asyncHandler(async (req, res) => {
  const { petId, title, dueAt, frequency } = req.body || {};

  // Validate required fields
  if (!petId || !title || !dueAt) {
    return res.status(400).json({ error: "Fields 'petId', 'title', and 'dueAt' are required" });
  }

  // Validate petId format
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }

  // Ensure the referenced pet exists
  const exists = await Pet.exists({ _id: petId });
  if (!exists) return res.status(400).json({ error: 'Invalid petId (pet does not exist)' });

  // Validate due date
  const due = new Date(dueAt);
  if (isNaN(due.getTime())) {
    return res.status(400).json({ error: "'dueAt' must be a valid date" });
  }

  // Create new reminder document
  const reminder = await Reminder.create({
    petId,
    title,
    dueAt: due,
    frequency: frequency || 'once', // default if not provided
  });

  res.status(201).json(reminder);
});

/**
 * PATCH /api/reminders/:reminderId
 *
 * Partially update reminder fields.
 * Allowed fields: title, dueAt, frequency, completed
 * 200: updated reminder
 * 400: invalid id / invalid date
 * 404: reminder not found
 */
exports.updateReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ error: 'Invalid reminderId' });
  }

  const allowed = ['title', 'dueAt', 'frequency', 'completed'];
  const updates = {};

  // Only accept allowed updates
  Object.keys(req.body || {}).forEach((k) => {
    if (!allowed.includes(k)) return;

    // Validate date field if being updated
    if (k === 'dueAt') {
      const d = new Date(req.body.dueAt);
      if (!isNaN(d.getTime())) updates.dueAt = d;
    } else {
      updates[k] = req.body[k];
    }
  });

  // Update and return the updated version
  const r = await Reminder.findByIdAndUpdate(reminderId, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!r) return res.status(404).json({ error: 'Reminder not found' });

  res.json(r);
});

/**
 * DELETE /api/reminders/:reminderId
 *
 * Deletes a reminder.
 * 200: { ok:true, deleted:<id> }
 * 400: invalid id
 * 404: not found
 */
exports.deleteReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ error: 'Invalid reminderId' });
  }

  const removed = await Reminder.findByIdAndDelete(reminderId).lean();
  if (!removed) return res.status(404).json({ error: 'Reminder not found' });

  res.json({ ok: true, deleted: removed._id });
});
