import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

const app = await import('./app.ts');
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
    const file = path.join(import.meta.dirname, 'tasks.json');
    const before = await readFile(file, 'utf8');
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
      await writeFile(file, before);
      server.close();
    }
  });
  it('should update a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const file = path.join(import.meta.dirname, 'tasks.json');
    const before = await readFile(file, 'utf8');
    try {
      const currentTasks = await fetch(
        `http://127.0.0.1:${address.port}/tasks`,
      ).then((res) => res.json());
      const taskId = currentTasks[0].id;

      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${taskId}`,
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
      await writeFile(file, before);
      server.close();
    }
  });
  it('should delete a task', async () => {
    const server = app.default.listen(0);
    const address = server.address() as AddressInfo;
    const file = path.join(import.meta.dirname, 'tasks.json');
    const before = await readFile(file, 'utf8');
    try {
      const currentTasks = await fetch(
        `http://127.0.0.1:${address.port}/tasks`,
      ).then((res) => res.json());
      const taskId = currentTasks[0].id;
      const response = await fetch(
        `http://127.0.0.1:${address.port}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      assert.equal(response.status, 200);
    } finally {
      await writeFile(file, before);
      server.close();
    }
  });
});
