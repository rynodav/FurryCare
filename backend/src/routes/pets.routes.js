// src/routes/pets.routes.js
const express = require('express');
const ctrl = require('../controllers/pets.controller'); // import the whole module

const router = express.Router();

// TEMP: log exports to confirm what's available
// (you can comment this out after it starts)
console.log('pets.controller exports:', Object.keys(ctrl));

router.get('/', ctrl.listPets);
router.post('/', ctrl.createPet);
router.get('/:petId', ctrl.getPet);
router.patch('/:petId', ctrl.updatePet);
router.delete('/:petId', ctrl.deletePet);

module.exports = router;
