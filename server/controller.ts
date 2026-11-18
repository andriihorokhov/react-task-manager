import type { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { scrypt, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import {
  getTasksPrisma,
  createTaskPrisma,
  updateTaskPrisma,
  deleteTaskPrisma,
  registerUserPrisma,
  loginUserPrisma,
} from './tasks.ts';
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

  const tasks = await getTasksPrisma(user?.userId);

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
  const newTask = await createTaskPrisma(user?.userId, task.title);
  if (!newTask) {
    return res.status(404).json({ error: 'User or project not found' });
  }
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

  const updatedTask = await updateTaskPrisma(
    user?.userId,
    parseInt(id as string),
    task.title,
    task.completed,
  );
  if (!updatedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }
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
  const deletedTask = await deleteTaskPrisma(
    user?.userId,
    parseInt(id as string),
  );
  if (!deletedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json({ message: 'Task deleted successfully' });
};

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = registerUserSchema.parse(req.body);
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = await new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(derivedKey.toString('hex'));
    });
  });
  await registerUserPrisma(email, `${passwordHash}:${salt}`);

  res.status(201).json({ message: 'User registered successfully' });
};
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = loginUserSchema.parse(req.body);
  const user = await loginUserPrisma(email);
  if (!user) {
    const salt = crypto.randomBytes(16).toString('hex');
    await new Promise<string>((resolve, reject) => {
      scrypt(password, salt, 32, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(derivedKey.toString('hex'));
      });
    });
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const [hash, salt] = user.password.split(':');
  const passwordMatch = await new Promise<boolean>((resolve, reject) => {
    scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(timingSafeEqual(derivedKey, Buffer.from(hash, 'hex')));
    });
  });
  if (!passwordMatch)
    return res.status(401).json({ message: 'Invalid credentials' });
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
