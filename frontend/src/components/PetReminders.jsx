// Toast notifications for user feedback
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';

// API functions for reminders CRUD operations
import {
  listReminders,
  createReminder,
  updateReminder,
  deleteReminder
} from '../api/reminders';

/**
 * Component for managing reminders for a specific pet
 * - Displays list of reminders
 * - Add new reminder form
 * - Mark reminder complete / pending
 * - Delete reminder
 */
export default function PetReminders({ petId }) {
  // Local state
  const [items, setItems] = useState([]);                             // Reminder list
  const [form, setForm] = useState({ title: '', dueAt: '', frequency: 'once' }); // Form inputs
  const [loading, setLoading] = useState(false);                      // Loading reminders
  const [saving, setSaving] = useState(false);                        // Saving new reminder
  const [mutatingId, setMutatingId] = useState(null);                 // Track reminder being updated/deleted

  /**
   * Load reminders for the selected pet
   * Sorted by due date (soonest first)
   */
  const load = async () => {
    if (!petId) { setItems([]); return; }

    setLoading(true);
    try {
      const data = await listReminders(petId);

      // Sort client-side as safety (API also sorted)
      data.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  // Load reminders when pet changes
  useEffect(() => { load(); }, [petId]);

  /**
   * Add a new reminder
   */
  const add = async (e) => {
    e.preventDefault();
    if (!petId) return;
    if (!form.title || !form.dueAt) return; // Required fields

    setSaving(true);
    try {
      await createReminder({
        petId,
        title: form.title,
        dueAt: new Date(form.dueAt).toISOString(),
        frequency: form.frequency,
      });

      toast.success('Reminder added');
      setForm({ title: '', dueAt: '', frequency: 'once' }); // Reset form
      await load(); // Refresh list
    } catch (err) {
      toast.error(err?.message || 'Failed to add reminder');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle reminder completion
   */
  const toggle = async (id, completed) => {
    setMutatingId(id);
    try {
      await updateReminder(id, { completed: !completed });
      toast.success(!completed ? 'Marked complete' : 'Marked pending');
      await load();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setMutatingId(null);
    }
  };

  /**
   * Delete reminder
   */
  const remove = async (id) => {
    if (!confirm('Delete this reminder?')) return;
    setMutatingId(id);

    try {
      await deleteReminder(id);
      toast.success('Reminder deleted');
      await load();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setMutatingId(null);
    }
  };

  // If no pet selected yet
  if (!petId) return <div className="text-sm opacity-70">Select a pet to manage reminders.</div>;

  const now = Date.now();

  // UI: reminder list + form
  return (
    <div>
      {/* <h2 className="text-xl font-semibold mb-2">Reminders</h2> */}

      {/* Reminders list */}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm opacity-70">No reminders yet. Add one below.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(r => {
            const isCompleted = !!r.completed;
            const isOverdue = !isCompleted && new Date(r.dueAt).getTime() < now;

            return (
              <li
                key={r._id}
                className="p-3 rounded border flex items-center justify-between"
                style={isOverdue ? { borderColor: 'red' } : {}}
              >
                <div>
                  {/* Reminder title */}
                  <div
                    className="font-medium"
                    style={{
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      opacity: isCompleted ? 0.6 : 1,
                      color: isOverdue ? 'red' : 'inherit',
                    }}
                  >
                    {r.title}
                    {isOverdue && <span style={{ marginLeft: 6, fontSize: 12 }}>(overdue)</span>}
                  </div>

                  {/* Due date + frequency */}
                  <div className="text-sm opacity-80">
                    Due: {new Date(r.dueAt).toLocaleString()} • {r.frequency}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    disabled={mutatingId === r._id}
                    onClick={() => toggle(r._id, r.completed)}
                  >
                    {r.completed ? 'Mark Pending' : 'Complete'}
                  </button>

                  <button
                    className="px-2 py-1 border rounded"
                    disabled={mutatingId === r._id}
                    onClick={() => remove(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Add reminder form */}
      <form onSubmit={add} className="mt-4 space-y-2">
        <h3 className="font-semibold">Add Reminder</h3>

        {/* Reminder title */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        {/* Date/time + frequency */}
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border p-2 rounded"
            type="datetime-local"
            value={form.dueAt}
            onChange={e => setForm({ ...form, dueAt: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={form.frequency}
            onChange={e => setForm({ ...form, frequency: e.target.value })}
          >
            <option value="once">once</option>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          className="px-3 py-2 rounded border"
          disabled={saving || !form.title || !form.dueAt}
          title={!form.title || !form.dueAt ? 'Title and Due date required' : ''}
        >
          {saving ? 'Saving…' : 'Save Reminder'}
        </button>
      </form>
    </div>
  );
}
