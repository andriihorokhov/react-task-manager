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

const registerUser = async (
  email: string,
  server: Server,
  name: string = 'Test User',
) => {
  const address = server.address() as AddressInfo;
  return await fetch(`http://127.0.0.1:${address.port}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      name: name,
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
      const getResponseData = (await getResponse.json()) as unknown[];
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
  // invalid body
  it('should return a 400 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test11.com', server);
      const loginResponse = await loginUser('test@test11.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(`http://127.0.0.1:${address.port}/tasks`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 123 }),
        method: 'POST',
      });
      assert.equal(response.status, 400);
      const responseData = (await response.json()) as { message: string };
      assert.equal(responseData.message, 'Invalid request body');
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test11.com',
        },
      });
      server.close();
    }
  });
  // email already exists
  it('should return a 409 status code', async () => {
    const server = app.default.listen(0);
    await registerUser('test@test12.com', server);
    try {
      const response = await registerUser('test@test12.com', server);
      assert.equal(response.status, 409);
      const responseData = (await response.json()) as { message: string };
      assert.equal(responseData.message, 'Email already exists');
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test12.com',
        },
      });
      server.close();
    }
  });
  // 500 error
  it('should return a 500 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    await registerUser('test@test13.com', server);
    const loginResponse = await loginUser('test@test13.com', server);
    const cookie = loginResponse.headers
      .get('Set-Cookie')
      ?.split(';')[0] as string;
    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/not-a-number`,
        {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: 'Updated Task' }),
        },
      );

      assert.equal(response.status, 500);
      const responseData = (await response.json()) as {
        error: string;
        message: string;
      };
      assert.equal(responseData.error, 'Internal server error');
      assert.equal(responseData.message, 'Internal server error');
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test13.com',
        },
      });
      server.close();
    }
  });
  // Email not found
  it('should return a 401 status code', async () => {
    const server = app.default.listen(0);
    try {
      const response = await loginUser('test@test14.com', server);
      assert.equal(response.status, 401);
      const responseData = (await response.json()) as { message: string };
      assert.equal(responseData.message, 'Invalid credentials');
    } finally {
      server.close();
    }
  });
  // Invalid password
  it('should return a 401 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test15.com', server);
      const response = await fetch(`http://127.0.0.1:${address.port}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test15.com',
          password: 'invalid123456789',
        }),
      });
      assert.equal(response.status, 401);
      const responseData = (await response.json()) as { message: string };
      assert.equal(responseData.message, 'Invalid credentials');
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test15.com',
        },
      });
      server.close();
    }
  });
  // other cookie before token
  it('should return a 401 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    await registerUser('test@test16.com', server);

    try {
      const loginResponse = await loginUser('test@test16.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      // get /tasks
      const getResponse = await fetch(
        `http://127.0.0.1:${address.port}/tasks`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Cookie: 'foo=bar; ' + cookie,
          },
        },
      );
      assert.equal(getResponse.status, 200);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test16.com',
        },
      });
      server.close();
    }
  });
  // /projects without cookie
  it('should return a 401 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test17.com', server);
      await loginUser('test@test17.com', server);

      const response = await fetch(
        `http://127.0.0.1:${address.port}/projects`,
        {
          credentials: 'include',
        },
      );
      assert.equal(response.status, 401);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test17.com',
        },
      });
      server.close();
    }
  });
  // two accounts
  it('should not allow a user to access a project they did not create', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test18.com', server);
      const user1 = await prisma.user.findUnique({
        where: {
          email: 'test@test18.com',
        },
      });
      if (!user1) {
        throw new Error('User not found');
      }
      const project1 = await createProject(user1.id);
      await registerUser('test@test19.com', server);
      const loginResponse1 = await loginUser('test@test18.com', server);
      const cookie1 = loginResponse1.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const loginResponse2 = await loginUser('test@test19.com', server);
      const cookie2 = loginResponse2.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      // GET /projects user1
      const getResponse = await fetch(
        `http://127.0.0.1:${address.port}/projects`,
        {
          credentials: 'include',
          headers: {
            Cookie: cookie1,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      );
      // GET /projects user2
      const getResponse2 = await fetch(
        `http://127.0.0.1:${address.port}/projects`,
        {
          credentials: 'include',
          headers: {
            Cookie: cookie2,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      );
      const getResponseData1 = (await getResponse.json()) as { id: number }[];
      const getResponseData2 = (await getResponse2.json()) as { id: number }[];
      // chech users project1 is not in user2's projects
      assert.equal(
        getResponseData1.some((project) => project.id === project1.id),
        true,
      );
      assert.equal(
        getResponseData2.some((project) => project.id === project1.id),
        false,
      );
    } finally {
      const emails = ['test@test18.com', 'test@test19.com'];
      await prisma.task.deleteMany({
        where: {
          author: { email: { in: emails } },
        },
      });
      await prisma.project.deleteMany({
        where: {
          author: { email: { in: emails } },
        },
      });
      await prisma.user.deleteMany({
        where: {
          email: { in: emails },
        },
      });

      server.close();
    }
  });
  // /me
  it('should return a 200 status code and the user', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      await registerUser('test@test20.com', server, 'Alex');
      const user = await prisma.user.findUnique({
        where: {
          email: 'test@test20.com',
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const loginResponse = await loginUser('test@test20.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(`http://127.0.0.1:${address.port}/me`, {
        credentials: 'include',
        headers: {
          Cookie: cookie,
        },
      });
      //У відповіді name дорівнює переданому імені, поруч є id і email.
      const responseData = (await response.json()) as {
        name: string;
        id: number;
        email: string;
      };
      assert.equal(responseData.name, 'Alex');
      assert.equal(responseData.id, user.id);
      assert.equal(responseData.email, 'test@test20.com');
      assert.equal(response.status, 200);
    } finally {
      await prisma.user.delete({
        where: {
          email: 'test@test20.com',
        },
      });
      server.close();
    }
  });
  // name from 1 to 50 characters
  it('should return a 400 status code', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: '   ',
            email: 'test@test21.com',
            password: 'test123456',
          }),
        },
      );
      const user = await prisma.user.findUnique({
        where: {
          email: 'test@test21.com',
        },
      });
      assert.equal(user, null);
      assert.equal(response.status, 400);
    } finally {
      await prisma.user.deleteMany({
        where: {
          email: {
            in: ['test@test21.com'],
          },
        },
      });
      server.close();
    }
  });
  it('should return the deadline as the date that was sent', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    await registerUser('test@test22.com', server);
    const user = await prisma.user.findUnique({
      where: { email: 'test@test22.com' },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    try {
      const loginResponse = await loginUser('test@test22.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${task.id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deadline: '2026-04-15' }),
        },
      );
      const responseData = (await response.json()) as { deadline: string };
      assert.equal(response.status, 200);
      assert.equal(responseData.deadline, '2026-04-15');
    } finally {
      await deleteProjectAndUser(project.id, user.id);
      server.close();
    }
  });
  it('should clear the deadline when null is sent', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    await registerUser('test@test23.com', server);
    const user = await prisma.user.findUnique({
      where: { email: 'test@test23.com' },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const project = await createProject(user.id);
    const task = await createTask(user.id, project.id);
    await prisma.task.update({
      where: { id: task.id },
      data: { deadline: new Date('2026-04-15') },
    });
    try {
      const loginResponse = await loginUser('test@test23.com', server);
      const cookie = loginResponse.headers
        .get('Set-Cookie')
        ?.split(';')[0] as string;
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${task.id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deadline: null }),
        },
      );
      const responseData = (await response.json()) as { deadline: null };
      assert.equal(response.status, 200);
      assert.equal(responseData.deadline, null);
    } finally {
      await deleteProjectAndUser(project.id, user.id);
      server.close();
    }
  });
});
