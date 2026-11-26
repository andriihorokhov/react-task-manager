import prisma from '../server/db.ts';
import crypto from 'crypto';
import { scrypt } from 'crypto';
import { buildDemoData, demoUserName } from './demo-data.ts';
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
    name: demoUserName,
    password: `${passwordHash}:${salt}`,
  },
  select: {
    email: true,
    name: true,
    id: true,
  },
});

const projects = buildDemoData(new Date());
for (const project of projects) {
  await prisma.project.create({
    data: {
      name: project.name,
      description: project.description,
      authorId: user.id,
      tasks: {
        create: project.tasks.map((task) => ({
          name: task.name,
          description: task.description,
          published: task.completed,
          priority: task.priority,
          deadline: task.deadline,
          authorId: user.id,
        })),
      },
    },
  });
}

console.log(
  'User created:',
  user.email,
  user.name,
  `${projects.length} projects`,
);
prisma.$disconnect();
