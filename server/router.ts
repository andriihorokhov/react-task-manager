import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from './controller.ts';
import { getErrorMiddleware } from './middleware.ts';
import type { ErrorRequestHandler } from 'express';
const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.use(getErrorMiddleware as ErrorRequestHandler);
export default router;
