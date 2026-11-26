import type { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { scrypt, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import {
  getTasksPrisma,
  getProjectsPrisma,
  getProjectPrisma,
  updateProjectPrisma,
  deleteProjectPrisma,
  createProjectPrisma,
  createTaskForUserPrisma,
  createTaskPrisma,
  updateTaskPrisma,
  deleteTaskPrisma,
  registerUserPrisma,
  loginUserPrisma,
  getMePrisma,
} from './tasks.ts';
const formatDeadline = (deadline: Date | null) => {
  if (!deadline) return null;
  return deadline.toISOString().slice(0, 10);
};
const toDeadline = (deadline: string | null | undefined) => {
  if (deadline === undefined) return undefined;
  if (deadline === null) return null;
  return new Date(deadline);
};
const createTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string(),
  deadline: z.iso.date().nullable().optional(),
});
const updateTaskSchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
  deadline: z.iso.date().nullable().optional(),
});
const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
const getProjectSchema = z.object({
  id: z.string(),
});
const updateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
const registerUserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(50),
  password: z.string().min(8),
});
const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const getMe = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const me = await getMePrisma(user?.userId);
  res.status(200).json(me);
};
const getProjects = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  const projects = await getProjectsPrisma(user?.userId);
  res.status(200).json(projects);
};
const createProject = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const project = createProjectSchema.parse(req.body);
  const newProject = await createProjectPrisma(
    user?.userId,
    project.name,
    project.description,
  );
  if (!newProject) {
    return res.status(404).json({ error: 'User not found' });
  }
  const ProjectResponse = {
    id: newProject.id.toString(),
    name: newProject.name,
    description: newProject.description,
  };
  res.status(201).json(ProjectResponse);
};
const getProject = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = getProjectSchema.parse(req.params);
  const project = await getProjectPrisma(user?.userId, parseInt(id as string));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const ProjectResponse = {
    id: project.id.toString(),
    name: project.name,
    description: project.description,
    tasks: project.tasks.map((task) => ({
      id: task.id.toString(),
      name: task.name,
      description: task.description,
      published: task.published,
      priority: task.priority,
      deadline: formatDeadline(task.deadline),
    })),
  };
  res.status(200).json(ProjectResponse);
  return project;
};
const updateProject = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const project = updateProjectSchema.parse(req.body);
  const updatedProject = await updateProjectPrisma(
    user?.userId,
    parseInt(id as string),
    project.name,
    project.description,
  );
  if (!updatedProject) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const ProjectResponse = {
    id: updatedProject.id.toString(),
    name: updatedProject.name,
    description: updatedProject.description,
  };
  res.status(200).json(ProjectResponse);
};
const deleteProject = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const deletedProject = await deleteProjectPrisma(
    user?.userId,
    parseInt(id as string),
  );
  if (!deletedProject) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.status(200).json({ message: 'Project deleted successfully' });
};
const getTasks = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  const status =
    req.query.status === 'active' || req.query.status === 'completed'
      ? req.query.status
      : 'all';
  const search =
    typeof req.query.search === 'string' && req.query.search.trim() !== ''
      ? req.query.search
      : undefined;
  const tasks = await getTasksPrisma(
    user?.userId,
    status,
    search ? search.trim() : undefined,
  );

  const TasksResponse = tasks.map((task) => ({
    id: task.id.toString(),
    name: task.name,
    completed: task.published,
    priority: task.priority,
    deadline: formatDeadline(task.deadline),
  }));
  res.status(200).json(TasksResponse);
};
const createTaskInFirstProject = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const task = createTaskSchema.parse(req.body);
  const newTask = await createTaskForUserPrisma(
    user.userId,
    task.title,
    task.priority,
    toDeadline(task.deadline),
  );
  if (!newTask) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.status(201).json({
    id: newTask.id.toString(),
    title: newTask.name,
    completed: newTask.published,
    priority: newTask.priority,
    deadline: formatDeadline(newTask.deadline),
  });
};
const createTask = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: { userId?: number } }).user;
  if (!user?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const projectId = parseInt(id as string);
  const task = createTaskSchema.parse(req.body);
  const newTask = await createTaskPrisma(
    user?.userId,
    task.title,
    projectId,
    task.priority,
    toDeadline(task.deadline),
  );
  if (!newTask) {
    return res.status(404).json({ error: 'User or project not found' });
  }
  const TaskResponse = {
    id: newTask.id.toString(),
    title: newTask.name,
    completed: newTask.published,
    priority: newTask.priority,
    deadline: formatDeadline(newTask.deadline),
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
    task.priority,
    toDeadline(task.deadline),
  );
  if (!updatedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const TaskResponse = {
    id: updatedTask.id.toString(),
    title: updatedTask.name,
    completed: updatedTask.published,
    priority: updatedTask.priority,
    deadline: formatDeadline(updatedTask.deadline),
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
  const { email, name, password } = registerUserSchema.parse(req.body);
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
  await registerUserPrisma(email, name, `${passwordHash}:${salt}`);

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
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
    sameSite: 'none',
  });
  res.status(200).json();
};
const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
  res.status(200).json({ message: 'User logged out successfully' });
};
export {
  getTasks,
  createTaskInFirstProject,
  createTask,
  updateTask,
  deleteTask,
  registerUser,
  loginUser,
  createProject,
  logoutUser,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getMe,
};
