// Wraps async route handlers and forwards errors to Express error middleware
const asyncHandler = require('../middleware/async');
// Mongoose utilities (ObjectId validation, etc.)
const mongoose = require('mongoose');
// Pet Mongoose model (MongoDB collection)
const Pet = require('../models/pet.model');

/**
 * GET /api/pets
 * Fetch all pets (newest first).
 * 200: JSON array of pets
 */
exports.listPets = asyncHandler(async (req, res) => {
  // .lean() returns plain JS objects (faster, no Mongoose document overhead)
  const pets = await Pet.find().sort({ createdAt: -1 }).lean();
  res.json(pets);
});

/**
 * GET /api/pets/:petId
 * Fetch a single pet by id.
 * 200: pet JSON
 * 400: invalid id
 * 404: not found
 */
exports.getPet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  // Validate ObjectId upfront to avoid a cast error
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }

  // .lean() for performance (read-only)
  const pet = await Pet.findById(petId).lean();
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  res.json(pet);
});

/**
 * POST /api/pets
 * Create a new pet.
 * Body: { name:string*, type:string*, breed?:string, birthDate?:string|Date }
 * 201: created pet
 * 400: validation error
 */
exports.createPet = asyncHandler(async (req, res) => {
  const { name, type, breed, birthDate } = req.body || {};

  // Minimal required fields check
  if (!name || !type) {
    return res.status(400).json({ error: "Fields 'name' and 'type' are required" });
  }

  // Build the document to save (whitelist only known fields)
  const toSave = { name, type };
  if (breed != null) toSave.breed = breed;

  // Optional birthDate parsing/validation
  if (birthDate != null) {
    const d = new Date(birthDate);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ error: "'birthDate' must be a valid date" });
    }
    toSave.birthDate = d;
  }

  // Persist and return 201 with the created doc
  const pet = await Pet.create(toSave);
  res.status(201).json(pet);
});

/**
 * PATCH /api/pets/:petId
 * Partially update allowed fields on a pet.
 * Allowed fields: name, type, breed, birthDate
 * 200: updated pet
 * 400: invalid id / bad date
 * 404: not found
 */
exports.updatePet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }

  // Only permit specific keys to be updated
  const allowed = ['name', 'type', 'breed', 'birthDate'];
  const updates = {};

  Object.keys(req.body || {}).forEach((k) => {
    if (!allowed.includes(k)) return;

    if (k === 'birthDate') {
      // Parse date safely; ignore invalid date rather than crashing
      const d = new Date(req.body.birthDate);
      if (isNaN(d.getTime())) return; // silently skip invalid date
      updates.birthDate = d;
    } else {
      updates[k] = req.body[k];
    }
  });

  // new:true returns the updated document
  // runValidators:true enforces schema validation on updates
  const pet = await Pet.findByIdAndUpdate(petId, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  res.json(pet);
});

/**
 * DELETE /api/pets/:petId
 * Delete a pet by id.
 * 200: { ok:true, deleted: <id> }
 * 400: invalid id
 * 404: not found
 */
exports.deletePet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(400).json({ error: 'Invalid petId' });
  }

  const deleted = await Pet.findByIdAndDelete(petId).lean();
  if (!deleted) return res.status(404).json({ error: 'Pet not found' });

  res.json({ ok: true, deleted: deleted._id });
});

// Note: The in-memory __petsStore has been removed; MongoDB is the source of truth now.
