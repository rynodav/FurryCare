// src/utils/id.js

/**
 * Generates a simple unique ID string.
 *
 * Combines:
 *  - A base-36 random string
 *  - The current timestamp in base-36
 *
 * While MongoDB provides ObjectIds, this function can be useful
 * in cases where a client-side or temporary ID is needed.
 *
 * Example output: "kf9p3lz1mgs9f3"
 */
exports.newId = () =>
  // Convert random number and current time to base-36 for compact format
  Math.random().toString(36).slice(2) + Date.now().toString(36);
