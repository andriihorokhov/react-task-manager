import prisma from '../server/db.ts';
import crypto from 'crypto';
import { scrypt } from 'crypto';
const salt = crypto.randomBytes(16).toString('hex');
const passwordHash = await new Promise<string>((resolve, reject) => {
  scrypt('test123456', salt, 32, (err, derivedKey) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(derivedKey.toString('hex'));
  });
});

const existingUser = await prisma.user.findUnique({
  where: {
    email: 'test@test.com',
  },
});
if (existingUser) {
  await prisma.project.deleteMany({
    where: {
      authorId: existingUser.id,
    },
  });
  await prisma.task.deleteMany({
    where: {
      authorId: existingUser.id,
    },
  });
  await prisma.user.delete({
    where: {
      email: 'test@test.com',
    },
  });
}

const user = await prisma.user.create({
  data: {
    email: 'test@test.com',
    name: 'Test User',
    password: `${passwordHash}:${salt}`,
  },
  select: {
    email: true,
    name: true,
    id: true,
  },
});

const project = await prisma.project.create({
  data: {
    name: 'Test Project',
    description: 'Test Description',
    authorId: user.id,
  },
  select: {
    name: true,
    id: true,
  },
});

const task = await prisma.task.create({
  data: {
    name: 'Test Task',
    description: 'Test Description',
    projectId: project.id,
    authorId: user.id,
  },
  select: {
    name: true,
    description: true,
    projectId: true,
    authorId: true,
  },
});

console.log('User created:', user);
console.log('Project created:', project);
console.log('Task created:', task);
prisma.$disconnect();
