const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const Pet = require('../models/pet.model');

// GET /api/pets
exports.listPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 }).lean();
  res.json(pets);
});

// GET /api/pets/:petId
exports.getPet = asyncHandler(async (req, res) => {
  const { petId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }
  const pet = await Pet.findById(petId).lean();
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
});

// POST /api/pets
exports.createPet = asyncHandler(async (req, res) => {
  const { name, type, breed, birthDate } = req.body || {};
  if (!name || !type) {
    return res.status(400).json({ error: "Fields 'name' and 'type' are required" });
  }
  const toSave = { name, type };
  if (breed != null) toSave.breed = breed;
  if (birthDate != null) {
    const d = new Date(birthDate);
    if (isNaN(d.getTime())) return res.status(400).json({ error: "'birthDate' must be a valid date" });
    toSave.birthDate = d;
  }
  const pet = await Pet.create(toSave);
  res.status(201).json(pet);
});

// PATCH /api/pets/:petId
exports.updatePet = asyncHandler(async (req, res) => {
  const { petId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }

  const allowed = ['name', 'type', 'breed', 'birthDate'];
  const updates = {};
  Object.keys(req.body || {}).forEach(k => {
    if (!allowed.includes(k)) return;
    if (k === 'birthDate') {
      const d = new Date(req.body.birthDate);
      if (isNaN(d.getTime())) return;
      updates.birthDate = d;
    } else {
      updates[k] = req.body[k];
    }
  });

  const pet = await Pet.findByIdAndUpdate(petId, updates, { new: true, runValidators: true }).lean();
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
});

// DELETE /api/pets/:petId
exports.deletePet = asyncHandler(async (req, res) => {
  const { petId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }
  const deleted = await Pet.findByIdAndDelete(petId).lean();
  if (!deleted) return res.status(404).json({ error: 'Pet not found' });
  res.json({ ok: true, deleted: deleted._id });
});

// (No more __petsStore export; DB is the source of truth now)
