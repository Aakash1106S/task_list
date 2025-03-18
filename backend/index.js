const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./schemas/Task'); // Import Task schema

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// GET endpoint to fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST endpoint to add a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;

  // Validate all fields
  if (!title || !description || !dueDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newTask = new Task({ title, description, dueDate });
    await newTask.save();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
