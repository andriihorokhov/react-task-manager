type TaskStatus = 'all' | 'active' | 'completed';
type Priority = 'low' | 'medium' | 'high';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority?: Priority;
};

export type { TaskStatus, Priority, Task };
