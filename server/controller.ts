import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from './db.ts';
import crypto from 'node:crypto';
import { scryptSync } from 'node:crypto';
import jwt from 'jsonwebtoken';
const createTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string(),
});
const updateTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
});
const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const getTasks = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  const tasks = await prisma.task.findMany({
    where: {
      authorId: user?.userId,
    },
    select: {
      id: true,
      name: true,
      published: true,
      authorId: true,
    },
  });

  const TasksResponse = tasks.map((task) => ({
    id: task.id.toString(),
    title: task.name,
    completed: task.published,
    priority: 'low',
  }));
  res.status(200).json(TasksResponse);
};
const createTask = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const task = createTaskSchema.parse(req.body);
  const project = await prisma.project.findFirst({
    where: {
      authorId: user?.userId,
    },
    select: {
      id: true,
    },
  });
  if (!user?.userId || !project?.id) {
    return res.status(404).json({ error: 'User or project not found' });
  }
  const newTask = await prisma.task.create({
    data: {
      name: task.title,
      published: false,
      description: '',
      authorId: user?.userId,
      projectId: project?.id,
    },
  });
  const TaskResponse = {
    id: newTask.id.toString(),
    title: newTask.name,
    completed: newTask.published,
    priority: 'low',
  };

  res.status(201).json(TaskResponse);
};
const updateTask = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const task = updateTaskSchema.parse(req.body);
  const tasks = await prisma.task.findFirst({
    where: {
      id: parseInt(id as string),
      authorId: user?.userId,
    },
    select: {
      id: true,
      name: true,
      published: true,
      authorId: true,
    },
  });
  if (!tasks) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const updatedTask = await prisma.task.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      name: task.title ?? tasks?.name,
      published: task.completed ?? tasks?.published,
    },
    select: {
      id: true,
      name: true,
      published: true,
    },
  });

  const TaskResponse = {
    id: updatedTask.id.toString(),
    title: updatedTask.name,
    completed: updatedTask.published,
    priority: 'low',
  };
  res.status(200).json(TaskResponse);
};
const deleteTask = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(id as string),
      authorId: user?.userId,
    },
  });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  await prisma.task.delete({
    where: {
      id: parseInt(id as string),
    },
  });
  res.status(200).json({ message: 'Task deleted successfully' });
};

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = registerUserSchema.parse(req.body);
  const salt = crypto.randomBytes(16).toString('hex');
  await prisma.user.create({
    data: {
      email,
      name: email,
      password: `${scryptSync(password, salt, 32).toString('hex')}:${salt}`,
    },
  });

  res.status(201).json({ message: 'User registered successfully' });
};
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = loginUserSchema.parse(req.body);
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const [hash, salt] = user.password.split(':');
  const passwordMatch = scryptSync(password, salt, 32).toString('hex') === hash;
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' },
  );
  res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });
  res.status(200).json();
};
const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: true });
  res.status(200).json({ message: 'User logged out successfully' });
};
export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  registerUser,
  loginUser,
  logoutUser,
};
