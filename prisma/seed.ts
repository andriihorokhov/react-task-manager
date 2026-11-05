import prisma from '../server/db.ts';

const user = await prisma.user.create({
  data: {
    email: 'test@test.com',
    name: 'Test User',
    password: 'test',
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
