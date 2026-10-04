# Workflow runs — live task

A small Next.js app (App Router, TypeScript strict, TanStack Query).

- `app/page.tsx` — start here
- `app/api/runs/route.ts` — a fake API: `GET /api/runs` returns `{ runs: Run[] }` (you don't need to change it)
- `lib/types.ts` — the `Run` type
- `app/providers.tsx` — TanStack Query is already set up

Run it: `npm install` then `npm run dev`, and open http://localhost:3000 (the API is at http://localhost:3000/api/runs).

Use any tools you normally use, including AI assistants. Please think out loud.
