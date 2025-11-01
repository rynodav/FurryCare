// React hooks for state + lifecycle
import { useEffect, useState } from 'react';

// API helpers to fetch and create pets
import { listPets, createPet } from '../api/pets';

// Component for reminder management for the selected pet
import PetReminders from './PetReminders';

/**
 * Main pets page
 *
 * - Lists all pets
 * - Lets user select a pet
 * - Displays reminders for selected pet
 * - Contains form to add a new pet
 */
export default function Pets() {

  // List of pets returned from API
  const [pets, setPets] = useState([]);

  // Form inputs for creating a pet
  const [form, setForm] = useState({ name: '', type: '', breed: '', birthDate: '' });

  // ID of currently selected pet
  const [activePetId, setActivePetId] = useState(null);

  // Loading indicator for initial fetch
  const [loading, setLoading] = useState(false);

  /**
   * Load pets from backend API
   * If no pet is selected yet, auto-select the first one
   */
  const load = async () => {
    setLoading(true);
    try {
      const data = await listPets();
      setPets(data);

      // Auto select first pet if none selected
      if (data.length && !activePetId) {
        setActivePetId(data[0]._id);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load pets when component mounts
  useEffect(() => { load(); }, []);

  /**
   * Submit form => create new pet
   */
  const submit = async (e) => {
    e.preventDefault();

    // Prepare object to send
    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      breed: form.breed.trim() || undefined,
      birthDate: form.birthDate || undefined,
    };

    // Simple validation
    if (!payload.name || !payload.type) {
      return alert('Name and Type required');
    }

    await createPet(payload);

    // Reset form and reload list
    setForm({ name: '', type: '', breed: '', birthDate: '' });
    await load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT SIDE: Pets list + Add Pet Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Pets</h2>

        {/* Pets List */}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="space-y-2">
            {pets.map(p => (
              <li
                key={p._id}
                className={`p-3 rounded border cursor-pointer ${activePetId === p._id ? 'bg-gray-100' : ''}`}
                onClick={() => setActivePetId(p._id)}
              >
                {/* Pet name + type */}
                <div className="font-medium">
                  {p.name}
                  <span className="text-sm text-gray-500"> ({p.type})</span>
                </div>

                {/* Breed (optional) */}
                {p.breed && (
                  <div className="text-sm text-gray-600">
                    Breed: {p.breed}
                  </div>
                )}

                {/* Birth date (optional) */}
                {p.birthDate && (
                  <div className="text-sm text-gray-600">
                    Birth: {new Date(p.birthDate).toLocaleDateString()}
                  </div>
                )}
              </li>
            ))}

            {/* Empty state */}
            {!pets.length && (
              <li className="text-sm text-gray-500">
                No pets yet. Add one below.
              </li>
            )}
          </ul>
        )}

        {/* Add Pet Form */}
        <form onSubmit={submit} className="mt-4 space-y-2">
          <h3 className="font-semibold">Add Pet</h3>

          {/* Input fields */}
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={e=>setForm({...form, name:e.target.value})}
            />
            <input
              className="border p-2 rounded"
              placeholder="Type (Dog, Cat, …)"
              value={form.type}
              onChange={e=>setForm({...form, type:e.target.value})}
            />
            <input
              className="border p-2 rounded"
              placeholder="Breed (optional)"
              value={form.breed}
              onChange={e=>setForm({...form, breed:e.target.value})}
            />
            <input
              className="border p-2 rounded"
              type="date"
              value={form.birthDate}
              onChange={e=>setForm({...form, birthDate:e.target.value})}
            />
          </div>

          {/* Submit button */}
          <button className="px-3 py-2 rounded bg-black text-white">
            Save Pet
          </button>
        </form>
      </div>

      {/* RIGHT SIDE: Pet Reminders */}
      <div>
        <PetReminders petId={activePetId} />
      </div>
    </div>
  );
}
