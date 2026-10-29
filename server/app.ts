import express from 'express';
import router from './router.ts';
import cors from 'cors';
import { pathToFileURL } from 'node:url';

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

export default app;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
