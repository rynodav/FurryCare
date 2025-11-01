// backend/src/server.js

// Import core dependencies
const express = require('express');       // Web server framework (REST API)
const cors = require('cors');             // Allows requests from frontend (different origin)
const mongoose = require('mongoose');     // MongoDB connection + models
require('dotenv').config();               // Load .env variables into process.env

// Import custom middleware + routes
const { notFound, errorHandler } = require('./middleware/error');  // Error handling middleware
const petsRouter = require('./routes/pets.routes');                 // Pets API routes
const remindersRouter = require('./routes/reminders.routes');       // Reminders API routes
const { listReminders } = require('./controllers/reminders.controller'); // Handler for nested route

// Create the Express application instance
const app = express();

// -----------------------
// Middleware
// -----------------------

// Enable CORS so the React frontend can call the API
// Uses CORS_ORIGIN from .env or falls back to localhost:5173 (default Vite port)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// -----------------------
// Database Connection
// -----------------------

// Connect to MongoDB using connection string stored in .env
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📦 Database:', mongoose.connection.name);
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// -----------------------
// Routes
// -----------------------

// Health check endpoint — verifies API is running
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'FurryCare API' });
});

// REST routes for pets and reminders
app.use('/api/pets', petsRouter);
app.use('/api/reminders', remindersRouter);

// Nested reminders route: fetch reminders for a specific pet
// e.g. GET /api/pets/123/reminders
app.get('/api/pets/:petId/reminders', listReminders);

// -----------------------
// Error Handling
// -----------------------

// Handle unknown endpoints (404)
app.use(notFound);

// Central error handler (500 or custom error codes)
app.use(errorHandler);

// -----------------------
// Server Startup
// -----------------------

// Determine port from .env or use default 4000
const PORT = process.env.PORT || 4000;

// Start server and listen for requests
app.listen(PORT, () => {
  console.log(`🐾 FurryCare API listening on http://127.0.0.1:${PORT}`);
});
