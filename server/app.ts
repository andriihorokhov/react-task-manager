import express from 'express';
import router from './router.ts';
import cors from 'cors';
import { pathToFileURL } from 'node:url';

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }),
);
app.use(router);

export default app;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.env.PORT || !process.env.JWT_SECRET) {
    throw new Error('PORT or JWT_SECRET is not set');
  }
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
