import { Suspense } from 'react';
import ProjectsList from '../../../components/ProjectsList';
export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsList />
    </Suspense>
  );
}
