// src/routes/reminders.routes.js
const express = require('express');
const ctrl = require('../controllers/reminders.controller'); // import whole module

const router = express.Router();

// TEMP debug — see what's exported (remove after it works)
console.log('reminders.controller exports:', Object.keys(ctrl));

router.get('/', ctrl.listReminders);
router.post('/', ctrl.createReminder);
router.get('/:reminderId', ctrl.getReminder);
router.patch('/:reminderId', ctrl.updateReminder);
router.delete('/:reminderId', ctrl.deleteReminder);

module.exports = router;
