// src/middleware/error.js

/**
 * Middleware for handling routes that do not match any endpoint.
 * 
 * This runs only if no other route responded, meaning the request
 * path is invalid or missing. It returns a standard JSON 404 error.
 */
function notFound(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl, // returns the URL that wasn't matched
  });
}

/**
 * Centralized error-handling middleware for Express.
 * 
 * Any error thrown in controllers or middleware (including async errors
 * caught by asyncHandler) will be passed here via `next(err)`.
 * 
 * - Responds with a JSON error message
 * - Uses error.status if provided, otherwise defaults to 500
 * - In development, includes the stack trace for debugging
 * - In production, stack traces are hidden for security
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  const payload = {
    error: err.message || 'Server Error',
  };

  // Show stack trace only in development mode
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

// Export middleware functions
module.exports = { notFound, errorHandler };
