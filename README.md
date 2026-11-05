# Task Manager

A small task list on the Next.js App Router. The dashboard, the list, and a task page are file routes. The list itself stays in TanStack Query.

Live app: https://react-task-manager-nine-amber.vercel.app/

The deployed page renders the shell. Task rows are loaded in the browser from `http://localhost:3001`, so they show up only on a machine where the Express server in `server/` is running. A public API comes later.

## Routes

| URL           | Screen                                                |
| ------------- | ----------------------------------------------------- |
| `/`           | Counts for all, active, and completed tasks           |
| `/tasks`      | List, status filter, and the form that creates a task |
| `/tasks/[id]` | One task                                              |

## Run locally

PostgreSQL has to be running. Task rows live in that database. Before the commands below, write `DATABASE_URL` into `.env`, for example `postgresql://USER@localhost:5432/task_manager`.

```bash
npm install
createdb task_manager
npx prisma generate
npx prisma migrate deploy
node --watch --env-file=.env server/app.ts
npm run dev
```

Open http://localhost:3000. The API listens on the port in `.env`.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
DATABASE_URL="postgresql://USER@localhost:5432/task_manager_test" npm test
```

`npm run build` runs `next build`. `npm test` uses `task_manager_test`, not the database from `.env`. That database has to exist and already have the migrations applied.
