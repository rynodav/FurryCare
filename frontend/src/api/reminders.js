// Import shared API helper that wraps fetch() and handles JSON & errors
import { api } from './client';

/**
 * Fetch reminders.
 *
 * If a petId is provided, fetch reminders only for that pet:
 * GET /api/pets/:petId/reminders
 *
 * Otherwise, fetch all reminders:
 * GET /api/reminders
 */
export const listReminders = (petId) =>
  petId ? api(`/pets/${petId}/reminders`) : api('/reminders');

/**
 * Create a new reminder
 * POST /api/reminders
 *
 * `data` example:
 * {
 *   petId: '64abc123...',
 *   title: 'Vet appointment',
 *   dueAt: '2025-02-10T09:00',
 *   frequency: 'once'
 * }
 */
export const createReminder = (data) =>
  api('/reminders', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Update an existing reminder by ID (partial update)
 * PATCH /api/reminders/:id
 *
 * `data` may include fields like title, dueAt, frequency, completed
 */
export const updateReminder = (id, data) =>
  api(`/reminders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

/**
 * Delete a reminder by ID
 * DELETE /api/reminders/:id
 */
export const deleteReminder = (id) =>
  api(`/reminders/${id}`, { method: 'DELETE' });
