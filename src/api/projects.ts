import { Project } from '../types';
const API_URL: string = `${process.env.NEXT_PUBLIC_API_URL}/projects`;

function throwIfNotOk(response: Response, message: string) {
  if (response.ok) return;
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  throw new Error(message);
}

const getProjects = async () => {
  const response = await fetch(API_URL, {
    credentials: 'include',
  });
  throwIfNotOk(response, 'Failed to fetch projects');
  return (await response.json()) as Project[];
};

const getProject = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    credentials: 'include',
  });
  throwIfNotOk(response, 'Failed to fetch project');
  return (await response.json()) as Project;
};
export { getProjects, getProject };
