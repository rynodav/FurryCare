// src/middleware/error.js
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = {
    error: err.message || 'Server Error',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
