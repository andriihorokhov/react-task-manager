import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import prisma from './db.ts';
const app = await import('./app.ts');

const createUser = async (email: string) => {
  return await prisma.user.create({
    data: {
      email: email,
      name: 'Test User',
      password: 'test123456',
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

const registerUser = async (email: string, server: Server) => {
  const address = server.address() as AddressInfo;
  return await fetch(`http://127.0.0.1:${address.port}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      name: 'Test User',
      password: 'test123456',
    }),
    credentials: 'include',
  });
};

const loginUser = async (email: string, server: Server) => {
  const address = server.address() as AddressInfo;
  return await fetch(`http://127.0.0.1:${address.port}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: 'test123456',
    }),
    credentials: 'include',
  });
};
describe('Tasks API', () => {
  it('should return a 200 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const user = await createUser('test@test.com');
    const project = await createProject(user.id);
    const projectId = project.id;
    const userId = user.id;
    try {
      await registerUser('test@test1.com', server);
      const loginResponse = await loginUser('test@test1.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(`http://127.0.0.1:${address.port}/tasks`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
        },
      });
      assert.equal(response.status, 200);
    } finally {
      await deleteProjectAndUser(projectId, userId);
      await prisma.user.delete({
        where: {
          email: 'test@test1.com',
        },
      });
      server.close();
    }
  });
  it('should create a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;

    await registerUser('test@test10.com', server);
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@test10.com',
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const project = await createProject(user.id);
    const projectId = project.id;
    const userId = user.id;
    try {
      const loginResponse = await loginUser('test@test10.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(`http://127.0.0.1:${address.port}/tasks`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Task',
        }),
      });
      assert.equal(response.status, 201);
    } finally {
      await deleteProjectAndUser(projectId, userId);
      server.close();
    }
  });
  it('should update a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    await registerUser('test@test2.com', server);
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@test2.com',
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    const taskId = task.id;
    const userId = user.id;
    const projectId = project.id;
    try {
      const loginResponse = await loginUser('test@test2.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${taskId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: 'Updated Task' }),
        },
      );
      assert.equal(response.status, 200);
    } finally {
      await deleteProjectAndUser(projectId, userId);
      server.close();
    }
  });
  it('should delete a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    await registerUser('test@test3.com', server);
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@test3.com',
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    const taskId = task.id;
    const userId = user.id;
    const projectId = project.id;
    try {
      const loginResponse = await loginUser('test@test3.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${taskId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
        },
      );
      assert.equal(response.status, 200);
    } finally {
      await deleteProjectAndUser(projectId, userId);
      server.close();
    }
  });
  // register user
  it('should register a user', async () => {
    const server = app.default.listen(0);
    try {
      const response = await registerUser('test@test4.com', server);
      assert.equal(response.status, 201);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test4.com',
        },
      });
      server.close();
    }
  });
  // login user
  it('should login a user', async () => {
    const server = app.default.listen(0);
    try {
      await registerUser('test@test5.com', server);
      const response = await loginUser('test@test5.com', server);
      assert.equal(response.status, 200);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test5.com',
        },
      });
      server.close();
    }
  });
  // /tasks without cookie
  it('should return a 401 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test6.com', server);
      await loginUser('test@test6.com', server);

      const response = await fetch(`http://127.0.0.1:${address.port}/tasks`, {
        credentials: 'include',
      });
      assert.equal(response.status, 401);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test6.com',
        },
      });
      server.close();
    }
  });
  // /tasks with cookie
  it('should return a 200 status code and the tasks', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test7.com', server);
      const loginResponse = await loginUser('test@test7.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(`http://127.0.0.1:${address.port}/tasks`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
        },
      });
      assert.equal(response.status, 200);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test7.com',
        },
      });
      server.close();
    }
  });
  // two accounts
  // Два акаунти. Задачу першого створи через наявні хелпери Prisma, щоб автор був відомий. Другий заходить своїм cookie і робить три запити до цієї задачі:
  // GET /tasks не містить її id
  // PATCH не змінює її назву в базі
  // DELETE не видаляє рядок
  it('should not allow a user to access a task they did not create', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const user1 = await createUser('test@test8.com');
    const project = await createProject(user1.id);
    const task = await createTask(user1.id, project.id);
    const taskId = task.id;
    await registerUser('test@test9.com', server);
    try {
      const loginResponse = await loginUser('test@test9.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      // GET /tasks
      const getResponse = await fetch(
        `http://127.0.0.1:${address.port}/tasks`,
        {
          credentials: 'include',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      );
      const getResponseData = await getResponse.json();
      assert.equal(getResponseData.length, 0);

      // PATCH
      await fetch(`http://127.0.0.1:${address.port}/tasks/${taskId}`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Updated Task' }),
        method: 'PATCH',
      });
      const row = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });
      assert.equal(row?.name, 'Test Task');
      // DELETE
      await fetch(`http://127.0.0.1:${address.port}/tasks/${taskId}`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Updated Task' }),
        method: 'DELETE',
      });
      const row2 = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

      assert.notEqual(row2, null);
      assert.equal(getResponse.status, 200);
    } finally {
      await deleteProjectAndUser(project.id, user1.id);
      await prisma.user.delete({
        where: {
          email: 'test@test9.com',
        },
      });
      server.close();
    }
  });
});
