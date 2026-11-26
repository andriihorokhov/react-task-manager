type TaskStatus = 'all' | 'active' | 'completed';
type Priority = 'low' | 'medium' | 'high';

type Task = {
  id: string;
  projectId: string;
  name: string;
  description: string;
  completed: boolean;
  priority?: Priority;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  deadline: string | null;
};

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tasks: Task[];
};

export type { TaskStatus, Priority, Task, Project };
