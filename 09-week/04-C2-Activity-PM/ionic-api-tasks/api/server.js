const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: 'Study Ionic React',
    description: 'Practice useState, fetch and Ionic components.'
  },
  {
    id: 2,
    title: 'Create Express API',
    description: 'Build GET and POST endpoints using Express.'
  }
];

let nextId = 3;

app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({
      message: 'Task not found'
    });
  }

  res.status(200).json(task);
});

app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;

  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    !title.trim() ||
    !description.trim()
  ) {
    return res.status(400).json({
      message: 'Title and description are required'
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim()
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});