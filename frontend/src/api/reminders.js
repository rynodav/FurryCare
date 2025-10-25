import { api } from './client';

export const listReminders = (petId) =>
  petId ? api(`/pets/${petId}/reminders`) : api('/reminders');

export const createReminder = (data) =>
  api('/reminders', { method: 'POST', body: JSON.stringify(data) });

export const updateReminder = (id, data) =>
  api(`/reminders/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteReminder = (id) =>
  api(`/reminders/${id}`, { method: 'DELETE' });
