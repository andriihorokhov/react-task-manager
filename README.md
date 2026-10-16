# Task Manager

A small task list on the Next.js App Router. The dashboard, the list, and a task page are file routes. The list itself stays in TanStack Query.

Live app: https://react-task-manager-nine-amber.vercel.app/

The deployed page renders the shell. Task rows are loaded in the browser from `http://localhost:3001`, so they show up only on a machine where json-server is running. A public API comes later.

## Routes

| URL           | Screen                                                |
| ------------- | ----------------------------------------------------- |
| `/`           | Counts for all, active, and completed tasks           |
| `/tasks`      | List, status filter, and the form that creates a task |
| `/tasks/[id]` | One task                                              |

## Run locally

```bash
npm install
npx json-server db.json -p 3001
npm run dev
```

Open http://localhost:3000. `db.json` stays on your machine and is not in git. json-server expects a `tasks` array:

```json
{
  "tasks": [{ "id": "1", "title": "Write the week note", "completed": false }]
}
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` runs `next build`.
