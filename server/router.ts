import { Router } from 'express';
import {
  createTaskInFirstProject,
  createTask,
  getTasks,
  getProjects,
  updateTask,
  deleteTask,
  registerUser,
  loginUser,
  logoutUser,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getMe,
} from './controller.ts';
import {
  getErrorMiddleware,
  getTokenMiddleware,
  rateLimitMiddleware,
} from './middleware.ts';
import type { ErrorRequestHandler } from 'express';
const router = Router();
router.get('/me', getTokenMiddleware, getMe);
router.get('/projects', getTokenMiddleware, getProjects);
router.post('/projects', getTokenMiddleware, createProject);
router.get('/projects/:id', getTokenMiddleware, getProject);
router.patch('/projects/:id', getTokenMiddleware, updateProject);
router.delete('/projects/:id', getTokenMiddleware, deleteProject);
router.get('/tasks', getTokenMiddleware, getTasks);
router.post('/tasks', getTokenMiddleware, createTaskInFirstProject);
router.post('/projects/:id/tasks', getTokenMiddleware, createTask);
router.patch('/tasks/:id', getTokenMiddleware, updateTask);
router.delete('/tasks/:id', getTokenMiddleware, deleteTask);
router.post('/register', registerUser);
router.post('/login', rateLimitMiddleware, loginUser);
router.post('/logout', logoutUser);
router.use(getErrorMiddleware as ErrorRequestHandler);
export default router;
