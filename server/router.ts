import { Router } from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  registerUser,
  loginUser,
  logoutUser,
} from './controller.ts';
import {
  getErrorMiddleware,
  getTokenMiddleware,
  rateLimitMiddleware,
} from './middleware.ts';
import type { ErrorRequestHandler } from 'express';
const router = Router();
router.get('/tasks', getTokenMiddleware, getTasks);
router.post('/tasks', getTokenMiddleware, createTask);
router.patch('/tasks/:id', getTokenMiddleware, updateTask);
router.delete('/tasks/:id', getTokenMiddleware, deleteTask);
router.post('/register', registerUser);
router.post('/login', rateLimitMiddleware, loginUser);
router.post('/logout', logoutUser);
router.use(getErrorMiddleware as ErrorRequestHandler);
export default router;
