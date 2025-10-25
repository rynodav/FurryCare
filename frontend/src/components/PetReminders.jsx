import { useEffect, useState } from 'react';
import { listReminders, createReminder, updateReminder, deleteReminder } from '../api/reminders';

export default function PetReminders({ petId }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', dueAt: '', frequency: 'once' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!petId) { setItems([]); return; }
    setLoading(true);
    try {
      const data = await listReminders(petId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [petId]);

  const add = async (e) => {
    e.preventDefault();
    if (!petId) return alert('Select a pet first');
    if (!form.title || !form.dueAt) return alert('Title and Due date required');
    await createReminder({ petId, title: form.title, dueAt: new Date(form.dueAt).toISOString(), frequency: form.frequency });
    setForm({ title: '', dueAt: '', frequency: 'once' });
    await load();
  };

  const toggle = async (id, completed) => {
    await updateReminder(id, { completed: !completed });
    await load();
  };

  const remove = async (id) => {
    await deleteReminder(id);
    await load();
  };

  if (!petId) return <div className="text-sm text-gray-500">Select a pet to manage reminders.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Reminders</h2>
      {loading ? <p>Loading…</p> : (
        <ul className="space-y-2">
          {items.map(r => (
            <li key={r._id} className="p-3 rounded border flex items-center justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gray-600">
                  Due: {new Date(r.dueAt).toLocaleString()} • {r.frequency}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border rounded"
                        onClick={() => toggle(r._id, r.completed)}>
                  {r.completed ? 'Mark Pending' : 'Complete'}
                </button>
                <button className="px-2 py-1 border rounded" onClick={() => remove(r._id)}>Delete</button>
              </div>
            </li>
          ))}
          {!items.length && <li className="text-sm text-gray-500">No reminders yet.</li>}
        </ul>
      )}

      <form onSubmit={add} className="mt-4 space-y-2">
        <h3 className="font-semibold">Add Reminder</h3>
        <input className="border p-2 rounded w-full" placeholder="Title"
               value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2 rounded" type="datetime-local"
                 value={form.dueAt} onChange={e=>setForm({...form, dueAt:e.target.value})} />
          <select className="border p-2 rounded"
                  value={form.frequency} onChange={e=>setForm({...form, frequency:e.target.value})}>
            <option value="once">once</option>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
        </div>
        <button className="px-3 py-2 rounded bg-black text-white">Save Reminder</button>
      </form>
    </div>
  );
}
