// backend/server.js
const express = require('express');
const cors = require('cors');

const { notFound, errorHandler } = require('./middleware/error'); 
const petsRouter = require('./routes/pets.routes');               
const remindersRouter = require('./routes/reminders.routes');     
const { listReminders } = require('./controllers/reminders.controller'); 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'FurryCare API' });
});

app.use('/api/pets', petsRouter);
app.use('/api/reminders', remindersRouter);

// nested route for reminders per pet
const expressRouter = require('express').Router({ mergeParams: true });
expressRouter.get('/', listReminders);
app.use('/api/pets/:petId/reminders', expressRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`FurryCare API listening on http://127.0.0.1:${PORT}`);
});
