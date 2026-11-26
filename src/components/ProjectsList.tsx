'use client';
import { useProjects } from '../hooks/useProjects';
import Link from 'next/link';

export default function ProjectsList() {
  const { data, isLoading, error } = useProjects();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <ul className="flex flex-col gap-2">
        {data?.map((project) => (
          <li key={project.id} className="text-lg">
            <Link href={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
