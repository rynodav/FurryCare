// src/routes/pets.routes.js

// Import Express to create a router instance
const express = require('express');

// Import all controller functions for pets (list, create, get, update, delete)
const ctrl = require('../controllers/pets.controller');

const router = express.Router();

// Debug helper to confirm which controller functions are exported
// (useful during development; can be removed in production)
console.log('pets.controller exports:', Object.keys(ctrl));

/**
 * Route definitions for Pet resources
 *
 * GET    /api/pets         → list all pets
 * POST   /api/pets         → create a new pet
 * GET    /api/pets/:petId  → fetch a single pet by ID
 * PATCH  /api/pets/:petId  → update an existing pet
 * DELETE /api/pets/:petId  → delete a pet
 */

// Fetch all pets
router.get('/', ctrl.listPets);

// Create a new pet
router.post('/', ctrl.createPet);

// Get a single pet by id
router.get('/:petId', ctrl.getPet);

// Update an existing pet
router.patch('/:petId', ctrl.updatePet);

// Delete a pet
router.delete('/:petId', ctrl.deletePet);

// Export router to be mounted in the Express app
module.exports = router;
