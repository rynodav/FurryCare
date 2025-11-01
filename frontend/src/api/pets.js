// Import the shared API helper function
// This wraps fetch() and handles JSON + errors for us
import { api } from './client';

/**
 * Fetch the list of all pets
 * GET /api/pets
 *
 * Returns a Promise that resolves to an array of pet objects.
 */
export const listPets = () => api('/pets');

/**
 * Create a new pet
 * POST /api/pets
 *
 * `data` should be an object like:
 * { name: 'Fluffy', type: 'Dog', breed: 'Poodle', birthDate: '2020-01-01' }
 */
export const createPet = (data) =>
  api('/pets', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Get a single pet by its ID
 * GET /api/pets/:id
 *
 * Returns a Promise resolving to a pet object.
 */
export const getPet = (id) => api(`/pets/${id}`);
