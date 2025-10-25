import { api } from './client';

export const listPets = () => api('/pets');
export const createPet = (data) =>
  api('/pets', { method: 'POST', body: JSON.stringify(data) });
export const getPet = (id) => api(`/pets/${id}`);
