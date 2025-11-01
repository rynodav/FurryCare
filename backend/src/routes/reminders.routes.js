// src/routes/reminders.routes.js

// Import Express to create a router instance
const express = require('express');

// Import all reminder controller functions (CRUD handlers)
const ctrl = require('../controllers/reminders.controller');

const router = express.Router();

// Debug helper to confirm exported controller functions
// Useful during development; remove when stable
console.log('reminders.controller exports:', Object.keys(ctrl));

/**
 * Route definitions for Reminder resources
 *
 * GET    /api/reminders             → list reminders (optionally filtered by pet)
 * POST   /api/reminders             → create a new reminder
 * GET    /api/reminders/:id         → fetch a single reminder by ID
 * PATCH  /api/reminders/:id         → update selected reminder fields
 * DELETE /api/reminders/:id         → delete a reminder
 */

// List all reminders, or reminders for a specific pet if petId is provided
router.get('/', ctrl.listReminders);

// Create a new reminder
router.post('/', ctrl.createReminder);

// Retrieve a reminder by its ID
router.get('/:reminderId', ctrl.getReminder);

// Update a reminder's fields (partial update)
router.patch('/:reminderId', ctrl.updateReminder);

// Delete a reminder
router.delete('/:reminderId', ctrl.deleteReminder);

// Export the router for mounting in the main Express app
module.exports = router;
