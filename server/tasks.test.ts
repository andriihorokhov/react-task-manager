import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import prisma from './db.ts';
const app = await import('./app.ts');

const createUser = async (email: string) => {
  return await prisma.user.create({
    data: {
      email: email,
      name: 'Test User',
      password: 'test',
    },
  });
};
const createProject = async (userId: number) => {
  return await prisma.project.create({
    data: {
      name: 'Test Project',
      description: 'Test Description',
      authorId: userId,
    },
  });
};
const createTask = async (userId: number, projectId: number) => {
  return await prisma.task.create({
    data: {
      name: 'Test Task',
      description: 'Test Description',
      published: false,
      authorId: userId,
      projectId: projectId,
    },
  });
};

const deleteProjectAndUser = async (projectId: number, userId: number) => {
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
describe('Tasks API', () => {
  it('should return a 200 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/tasks`);
    assert.equal(response.status, 200);
    server.close();
  });
  it('should create a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;

    const user = await createUser('test@test.com');
    const project = await createProject(user.id);
    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Test Task' }),
      });
      assert.equal(response.status, 201);
    } finally {
      await deleteProjectAndUser(project.id, user.id);

      server.close();
    }
  });
  it('should update a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const user = await createUser('test@test2.com');
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${task.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: 'Updated Task' }),
        },
      );
      assert.equal(response.status, 200);
    } finally {
      await deleteProjectAndUser(project.id, user.id);
      server.close();
    }
  });
  it('should delete a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const user = await createUser('test@test3.com');
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${task.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      assert.equal(response.status, 200);
    } finally {
      await deleteProjectAndUser(project.id, user.id);
      server.close();
    }
  });
});
