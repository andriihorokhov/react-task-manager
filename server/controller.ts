import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from './db.ts';

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
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      name: true,
      published: true,
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
  const task = createTaskSchema.parse(req.body);
  const user = await prisma.user.findFirst({});
  const project = await prisma.project.findFirst({
    where: {
      authorId: user?.id,
    },
    select: {
      id: true,
    },
  });
  if (!user?.id || !project?.id) {
    return res.status(404).json({ error: 'User or project not found' });
  }
  const newTask = await prisma.task.create({
    data: {
      name: task.title,
      published: false,
      description: '',
      authorId: user?.id,
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
  const { id } = req.params;
  const task = updateTaskSchema.parse(req.body);
  const tasks = await prisma.task.findUnique({
    where: {
      id: parseInt(id as string),
    },
    select: {
      id: true,
      name: true,
      published: true,
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
  const { id } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(id as string),
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
export { getTasks, createTask, updateTask, deleteTask };
