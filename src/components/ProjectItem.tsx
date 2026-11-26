import type { Project } from '../types';

export default function ProjectItem({ project }: { project: Project }) {
  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <h3>Tasks</h3>
      <ul>
        {project.tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}
