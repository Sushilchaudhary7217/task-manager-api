import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: JSON body parse karne ke liye
app.use(express.json());

// In-memory storage
let tasks: Array<{ id: number; title: string; completed: boolean }> = [];
let nextId = 1;

// ROUTE 1: GET /tasks - Sabhi tasks fetch karo
app.get('/tasks', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// ROUTE 2: POST /tasks - Naya task create karo
app.post('/tasks', (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Title is required and must be a string'
    });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
});

// ROUTE 3: PUT /tasks/:id - Task update karo
app.put('/tasks/:id', (req: Request, res: Response) => {
  // FIX: 'as string' add kiya taaki TypeScript error na de
  const id = parseInt(req.params.id as string);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.completed !== undefined) task.completed = req.body.completed;

  res.json({
    success: true,
    data: task
  });
});

// ROUTE 4: DELETE /tasks/:id - Task delete karo
app.delete('/tasks/:id', (req: Request, res: Response) => {
  // FIX: Yahan bhi 'as string' add kiya
  const id = parseInt(req.params.id as string);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// ROUTE 5: GET /health - Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
