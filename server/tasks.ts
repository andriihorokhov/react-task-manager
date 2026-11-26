import prisma from './db.ts';
import type { Priority } from '../prisma/generated/enums.ts';

const getProjectsPrisma = async (userId?: number) => {
  if (!userId) {
    return [];
  }
  const projects = await prisma.project.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      name: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return projects;
};
const createProjectPrisma = async (
  userId: number,
  name: string,
  description?: string,
) => {
  if (!userId) {
    return null;
  }
  const newProject = await prisma.project.create({
    data: {
      name,
      description: description ?? '',
      authorId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  return newProject;
};
const getProjectPrisma = async (userId: number, projectId: number) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, authorId: userId },
    select: {
      id: true,
      name: true,
      description: true,
      tasks: true,
    },
  });
  return project;
};
const updateProjectPrisma = async (
  userId: number,
  projectId: number,
  name?: string,
  description?: string,
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, authorId: userId },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  if (!project) {
    return null;
  }
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: name ?? project.name,
      description: description ?? project.description,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  return updatedProject;
};
const deleteProjectPrisma = async (userId: number, projectId: number) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, authorId: userId },
  });
  if (!project) {
    return null;
  }
  await prisma.project.delete({ where: { id: projectId } });
  return true;
};
const getTasksPrisma = async (
  userId?: number,
  published: 'all' | 'active' | 'completed' = 'all',
  search?: string,
) => {
  if (!userId) {
    return [];
  }
  const tasks = await prisma.task.findMany({
    where: {
      authorId: userId,
      published:
        published === 'all' ? undefined : published === 'active' ? false : true,
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    orderBy: {
      deadline: 'asc',
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

const createTaskForUserPrisma = async (
  userId: number,
  title: string,
  priority?: Priority,
  deadline?: Date | null,
) => {
  const project = await prisma.project.findFirst({
    where: { authorId: userId },
    select: { id: true },
  });
  if (!project?.id) {
    return null;
  }
  return createTaskPrisma(userId, title, project.id, priority, deadline);
};
const createTaskPrisma = async (
  userId: number,
  title: string,
  projectId: number,
  priority?: Priority,
  deadline?: Date | null,
) => {
  const project = await prisma.project.findFirst({
    where: {
      authorId: userId,
      id: projectId,
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
  deadline?: Date | null,
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
      deadline: deadline === undefined ? task.deadline : deadline,
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
const getMePrisma = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  return user;
};
const registerUserPrisma = async (
  email: string,
  name: string,
  password: string,
) => {
  const user = await prisma.user.create({
    data: {
      email,
      name: name,
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
  createTaskForUserPrisma,
  createTaskPrisma,
  updateTaskPrisma,
  deleteTaskPrisma,
  registerUserPrisma,
  loginUserPrisma,
  getProjectsPrisma,
  createProjectPrisma,
  getProjectPrisma,
  updateProjectPrisma,
  deleteProjectPrisma,
  getMePrisma,
};
