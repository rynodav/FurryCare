const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const Pet = require('../models/pet.model');
const Reminder = require('../models/reminder.model');

// GET /api/reminders  (or /api/pets/:petId/reminders via nested route)
exports.listReminders = asyncHandler(async (req, res) => {
  const petId = req.params.petId || req.query.petId;
  const filter = {};
  if (petId) {
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(400).json({ error: 'Invalid petId' });
    }
    filter.petId = petId;
  }
  const reminders = await Reminder.find(filter).sort({ dueAt: 1 }).lean();
  res.json(reminders);
});

// GET /api/reminders/:reminderId
exports.getReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ error: 'Invalid reminderId' });
  }
  const r = await Reminder.findById(reminderId).lean();
  if (!r) return res.status(404).json({ error: 'Reminder not found' });
  res.json(r);
});

// POST /api/reminders
exports.createReminder = asyncHandler(async (req, res) => {
  const { petId, title, dueAt, frequency } = req.body || {};
  if (!petId || !title || !dueAt) {
    return res.status(400).json({ error: "Fields 'petId', 'title', and 'dueAt' are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }
  const exists = await Pet.exists({ _id: petId });
  if (!exists) return res.status(400).json({ error: 'Invalid petId (pet does not exist)' });

  const due = new Date(dueAt);
  if (isNaN(due.getTime())) return res.status(400).json({ error: "'dueAt' must be a valid date" });

  const reminder = await Reminder.create({
    petId,
    title,
    dueAt: due,
    frequency: frequency || 'once',
  });
  res.status(201).json(reminder);
});

// PATCH /api/reminders/:reminderId
exports.updateReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ error: 'Invalid reminderId' });
  }

  const allowed = ['title', 'dueAt', 'frequency', 'completed'];
  const updates = {};
  Object.keys(req.body || {}).forEach(k => {
    if (!allowed.includes(k)) return;
    if (k === 'dueAt') {
      const d = new Date(req.body.dueAt);
      if (!isNaN(d.getTime())) updates.dueAt = d;
    } else {
      updates[k] = req.body[k];
    }
  });

  const r = await Reminder.findByIdAndUpdate(reminderId, updates, { new: true, runValidators: true }).lean();
  if (!r) return res.status(404).json({ error: 'Reminder not found' });
  res.json(r);
});

// DELETE /api/reminders/:reminderId
exports.deleteReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res.status(400).json({ error: 'Invalid reminderId' });
  }
  const removed = await Reminder.findByIdAndDelete(reminderId).lean();
  if (!removed) return res.status(404).json({ error: 'Reminder not found' });
  res.json({ ok: true, deleted: removed._id });
});
