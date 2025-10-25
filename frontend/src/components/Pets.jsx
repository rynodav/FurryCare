import { useEffect, useState } from 'react';
import { listPets, createPet } from '../api/pets';
import PetReminders from './PetReminders';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: '', type: '', breed: '', birthDate: '' });
  const [activePetId, setActivePetId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPets();
      setPets(data);
      if (data.length && !activePetId) setActivePetId(data[0]._id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      breed: form.breed.trim() || undefined,
      birthDate: form.birthDate || undefined,
    };
    if (!payload.name || !payload.type) return alert('Name and Type required');
    await createPet(payload);
    setForm({ name: '', type: '', breed: '', birthDate: '' });
    await load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Pets</h2>
        {loading ? <p>Loading…</p> : (
          <ul className="space-y-2">
            {pets.map(p => (
              <li key={p._id}
                  className={`p-3 rounded border cursor-pointer ${activePetId===p._id ? 'bg-gray-100' : ''}`}
                  onClick={() => setActivePetId(p._id)}>
                <div className="font-medium">{p.name} <span className="text-sm text-gray-500">({p.type})</span></div>
                {p.breed ? <div className="text-sm text-gray-600">Breed: {p.breed}</div> : null}
                {p.birthDate ? <div className="text-sm text-gray-600">Birth: {new Date(p.birthDate).toLocaleDateString()}</div> : null}
              </li>
            ))}
            {!pets.length && <li className="text-sm text-gray-500">No pets yet. Add one below.</li>}
          </ul>
        )}

        <form onSubmit={submit} className="mt-4 space-y-2">
          <h3 className="font-semibold">Add Pet</h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2 rounded" placeholder="Name"
                   value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input className="border p-2 rounded" placeholder="Type (Dog, Cat, …)"
                   value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
            <input className="border p-2 rounded" placeholder="Breed (optional)"
                   value={form.breed} onChange={e=>setForm({...form, breed:e.target.value})} />
            <input className="border p-2 rounded" type="date"
                   value={form.birthDate} onChange={e=>setForm({...form, birthDate:e.target.value})} />
          </div>
          <button className="px-3 py-2 rounded bg-black text-white">Save Pet</button>
        </form>
      </div>

      <div>
        <PetReminders petId={activePetId} />
      </div>
    </div>
  );
}
