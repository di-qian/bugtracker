import express from 'express';
import dotenv from 'dotenv';
import bugs from './data/bugs.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/bugs', (req, res) => {
  res.json(bugs);
});

app.get('/api/bugs/:id', (req, res) => {
  const bug = bugs.find((b) => b._id === req.params.id);
  res.json(bug);
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
