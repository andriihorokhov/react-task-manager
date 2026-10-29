import type { Request, Response } from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
const taskSchema = z.object({
  id: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  title: z.string(),
  completed: z.boolean(),
});
const tasksSchema = z.object({
  tasks: z.array(taskSchema),
});
const createTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string(),
});
const updateTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
});
const getTasks = async (req: Request, res: Response) => {
  const tasks = await readFile(
    path.join(import.meta.dirname, 'tasks.json'),
    'utf8',
  );
  const tasksData = tasksSchema.parse(JSON.parse(tasks));
  res.status(200).json(tasksData.tasks);
};
const createTask = async (req: Request, res: Response) => {
  const task = createTaskSchema.parse(req.body);
  const tasks = await readFile(
    path.join(import.meta.dirname, 'tasks.json'),
    'utf8',
  );
  const tasksData = tasksSchema.parse(JSON.parse(tasks));
  tasksData.tasks.push({
    id: crypto.randomUUID(),
    completed: false,
    priority: task.priority ?? 'low',
    title: task.title,
  });

  await writeFile(
    path.join(import.meta.dirname, 'tasks.json'),
    JSON.stringify(tasksData, null, 2),
  );
  res.status(201).json(task);
};
const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = updateTaskSchema.parse(req.body);
  const tasks = await readFile(
    path.join(import.meta.dirname, 'tasks.json'),
    'utf8',
  );
  const tasksData = tasksSchema.parse(JSON.parse(tasks));
  const foundTask = tasksData.tasks.find((t) => t.id === id);
  if (!foundTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  foundTask.priority = task.priority ?? foundTask.priority;
  foundTask.title = task.title ?? foundTask.title;
  foundTask.completed = task.completed ?? foundTask.completed;

  console.log('foundTask', foundTask);

  await writeFile(
    path.join(import.meta.dirname, 'tasks.json'),
    JSON.stringify(tasksData, null, 2),
  );
  res.status(200).json(foundTask);
};
const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tasks = await readFile(
    path.join(import.meta.dirname, 'tasks.json'),
    'utf8',
  );
  const tasksData = tasksSchema.parse(JSON.parse(tasks));
  const foundTask = tasksData.tasks.find((t) => t.id === id);
  if (!foundTask) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasksData.tasks = tasksData.tasks.filter((t) => t.id !== id);
  await writeFile(
    path.join(import.meta.dirname, 'tasks.json'),
    JSON.stringify(tasksData, null, 2),
  );
  res.status(200).json({ message: 'Task deleted successfully' });
};
export { getTasks, createTask, updateTask, deleteTask };
