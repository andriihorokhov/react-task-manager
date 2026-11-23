import prisma from './db.ts';
import type { Priority } from '../prisma/generated/enums.ts';

const getTasksPrisma = async (userId?: number) => {
  if (!userId) {
    return [];
  }
  const tasks = await prisma.task.findMany({
    where: {
      authorId: userId,
    },
    select: {
      id: true,
      name: true,
      published: true,
      authorId: true,
      priority: true,
      deadline: true,
    },
  });
  return tasks;
};

const createTaskPrisma = async (
  userId: number,
  title: string,
  priority?: Priority,
  deadline?: Date,
) => {
  const project = await prisma.project.findFirst({
    where: {
      authorId: userId,
    },
    select: {
      id: true,
    },
  });
  if (!project?.id) {
    return null;
  }
  const newTask = await prisma.task.create({
    data: {
      name: title,
      published: false,
      projectId: project.id,
      authorId: userId,
      description: '',
      priority: priority,
      deadline: deadline,
    },
    select: {
      id: true,
      name: true,
      published: true,
      projectId: true,
      authorId: true,
      priority: true,
      deadline: true,
    },
  });
  return newTask;
};

const updateTaskPrisma = async (
  userId: number,
  taskId: number,
  title?: string,
  published?: boolean,
  priority?: Priority,
  deadline?: Date,
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      authorId: userId,
    },
    select: {
      id: true,
      name: true,
      published: true,
      priority: true,
      deadline: true,
    },
  });
  if (!task) {
    return null;
  }
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      name: title ?? task.name,
      published: published ?? task.published,
      priority: priority ?? task.priority,
      deadline: deadline ?? task.deadline,
    },
    select: {
      id: true,
      name: true,
      published: true,
      priority: true,
      deadline: true,
    },
  });
  return updatedTask;
};
const deleteTaskPrisma = async (userId: number, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, authorId: userId },
  });
  if (!task) {
    return null;
  }
  await prisma.task.delete({ where: { id: taskId } });
  return true;
};

const registerUserPrisma = async (email: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      email,
      name: email,
      password: password,
    },
  });
  return user;
};

const loginUserPrisma = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    return null;
  }
  return user;
};
export {
  getTasksPrisma,
  createTaskPrisma,
  updateTaskPrisma,
  deleteTaskPrisma,
  registerUserPrisma,
  loginUserPrisma,
};
