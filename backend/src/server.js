// backend/src/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { notFound, errorHandler } = require('./middleware/error');
const petsRouter = require('./routes/pets.routes');
const remindersRouter = require('./routes/reminders.routes');
const { listReminders } = require('./controllers/reminders.controller'); // ✅ keep this ONE import

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📦 Database:', mongoose.connection.name);
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'FurryCare API' });
});

app.use('/api/pets', petsRouter);
app.use('/api/reminders', remindersRouter);

// Nested: /api/pets/:petId/reminders
app.get('/api/pets/:petId/reminders', listReminders);


// Errors
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🐾 FurryCare API listening on http://127.0.0.1:${PORT}`);
});
