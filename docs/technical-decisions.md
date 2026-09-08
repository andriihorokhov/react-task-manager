# Technical decisions

## Styling: Tailwind CSS (not CSS Modules)

Task Manager uses **Tailwind**. I already have production SCSS; CSS Modules would mostly repeat that model (files + class names, plus hashing). The gap is reading and changing **utility classes** — common in React / Next codebases and in AI-generated UI.

**Not using:** CSS Modules in this repo (understood from the course: they exist to scope class names). **Not using:** styled-components.

Setup and a few components get utilities; this is not a pixel-perfect design pass.

**How:** Tailwind **v4** via `@tailwindcss/vite`. CSS entry: `@import "tailwindcss"` in `src/index.css`. Needs **Node 20+** (`nvm use 24` in this project).
