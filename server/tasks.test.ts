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

    const user = await createUser('test@test.com');
    const project = await createProject(user.id);
    const projectId = project.id;
    const userId = user.id;
    try {
      await registerUser('test@test2.com', server);
      const loginResponse = await loginUser('test@test2.com', server);
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
      await prisma.user.delete({
        where: {
          email: 'test@test2.com',
        },
      });
      server.close();
    }
  });
  it('should update a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const user = await createUser('test@test2.com');
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    const taskId = task.id;
    const userId = user.id;
    const projectId = project.id;
    try {
      await registerUser('test@test3.com', server);
      const loginResponse = await loginUser('test@test3.com', server);
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
      await prisma.user.delete({
        where: {
          email: 'test@test3.com',
        },
      });
      server.close();
    }
  });
  it('should delete a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const user = await createUser('test@test3.com');
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    const taskId = task.id;
    const userId = user.id;
    const projectId = project.id;
    try {
      await registerUser('test@test4.com', server);
      const loginResponse = await loginUser('test@test4.com', server);
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
      await prisma.user.delete({
        where: {
          email: 'test@test4.com',
        },
      });
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
});
