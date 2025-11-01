// Base URL for all API requests (relative to the backend routes)
const BASE = '/api';

/**
 * A small helper function to call backend API routes.
 *
 * - Prefixes all requests with `/api`
 * - Automatically attaches JSON headers
 * - Throws clean errors when response is not OK
 *
 * Usage example:
 *   api('/pets', { method: 'POST', body: JSON.stringify(data) })
 *   api('/pets')
 *
 * This keeps fetch calls consistent and reduces repetition.
 */
export async function api(path, options = {}) {
  // Send request using fetch, ensuring JSON header is included
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}), // include any extra headers passed in
    },
    ...options, // method, body, etc.
  });

  // If response status is not OK (e.g., 400, 404, 500), throw an error
  if (!res.ok) {
    const err = await res.json().catch(() => ({})); // Try to read error JSON
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  // Otherwise, return JSON response body
  return res.json();
}
