# Technical decisions

## Styling: Tailwind CSS (not CSS Modules)

Task Manager uses **Tailwind**. I already have production SCSS; CSS Modules would mostly repeat that model (files + class names, plus hashing). The gap is reading and changing **utility classes** — common in React / Next codebases and in AI-generated UI.

**Not using:** CSS Modules in this repo (understood from the course: they exist to scope class names). **Not using:** styled-components.

Setup and a few components get utilities; this is not a pixel-perfect design pass.

**How:** Tailwind **v4**. CSS entry: `@import "tailwindcss"` in `src/index.css`. Next loads it through `@tailwindcss/postcss` in `postcss.config.mjs`. The Vite plugin is still installed; `next dev` does not run it. Needs **Node 20+** (`nvm use 24` in this project).

## Routing: Next.js App Router (not React Router)

The same three URLs used to be a `createBrowserRouter` config. They are files now.

| URL           | File                          |
| ------------- | ----------------------------- |
| `/`           | `src/app/page.tsx`            |
| `/tasks`      | `src/app/tasks/page.tsx`      |
| `/tasks/[id]` | `src/app/tasks/[id]/page.tsx` |

`src/app/layout.tsx` is the document (`<html>`, `<body>`). The nested page arrives as `children`, which is what `Outlet` used to be. The nav is `Link` from `next/link`. The active link is `usePathname()` compared to the href, so `/tasks/1` does not mark Tasks active.

`npm run dev` and `npm run build` both run Next. Vite's `index.html` and `src/main.tsx` are not that build.

## The task list stays in Query

`useTasks` still owns the list: `useQuery` with the key `['tasks']`, and create, edit, toggle, and delete through `useMutation`. Those calls go to `src/api/tasks.ts`, which fetches `http://localhost:3001/tasks`.

The dashboard, `/tasks`, and `/tasks/[id]` each call `useTasks`, so they share one cache entry. A fetch inside `page.tsx` would be a second source for the same rows. Server actions are not used. `TaskForm` still submits with `onSubmit`.

## Which files are client

`"use client"` is on a file that a server component imports directly and that uses hooks or motion.

| File                            | Why it cannot be a server component                |
| ------------------------------- | -------------------------------------------------- |
| `src/app/providers.tsx`         | `useState` holds one `QueryClient` for the browser |
| `src/components/Layout.tsx`     | `usePathname`, `AnimatePresence`                   |
| `src/components/Dashboard.tsx`  | `useTasks`                                         |
| `src/App.tsx`                   | `useTasks`, `useSearchParams`, `useRouter`         |
| `src/components/TaskDetail.tsx` | `useTasks`, `useParams`                            |
| `src/app/error.tsx`             | Next requires this file to be a client component   |

`src/app/layout.tsx` and the three `page.tsx` files stay server components. They only render the client files above.

`TaskList`, `TaskItem`, `TaskItemEdit`, `TaskForm`, and `FilterButtons` use state, clicks, or motion and have no directive of their own. They are imported from `App` or `TaskDetail`, which are already client components.

окремий Express це процес який окремо від застосунку next тому що ми робитимемом бекенд окремо на node експрес лежить, покладемо в папку server в корені поруч з src. для цього застосунку route handlers теж вистачило б

таблиці:
users: id name email(унікальний) password
projects: id name description user_id(посилається на таблицю users)
tasks: id name description project_id(посилається на таблицю projects) user_id(посилається на таблицю users)

всі колонки обовязкові

коли роект видаляють то всі задачі цьго проекту теж видаляються

id в таблицях - первинний ключ
