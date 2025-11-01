// src/middleware/async.js

/**
 * A higher-order function that wraps async route handlers.
 * 
 * Express does not automatically catch rejected promises
 * in async functions. Without this, you would need a try/catch
 * inside every controller method.
 * 
 * This middleware ensures that if an async handler throws an error
 * or returns a rejected promise, Express passes it to the
 * built-in error handler via `next(err)`.
 * 
 * Example usage:
 * router.get('/pets', asyncHandler(listPets))
 */
module.exports = fn => (req, res, next) => {
  // Execute the async function and catch any errors
  Promise
    .resolve(fn(req, res, next))
    .catch(next); // Forward error to Express error middleware
};
