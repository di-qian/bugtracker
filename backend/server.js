const express = require('express');
const bugs = require('./data/bugs');

const app = express();

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/bugs', (req, res) => {
  res.json(bugs);
});

app.get('/api/bugs/:id', (req, res) => {
  const bug = bugs.find((b) => b._id === req.params.id);
  res.json(bug);
});

app.listen(5000, console.log('Server running on port 5000'));
