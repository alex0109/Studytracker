# StudyTracker

StudyTracker is a web application for active learning: add study materials (links, text, notes), turn them into quiz questions (open-ended and multiple-choice), take attempts, and track your progress in the statistics dashboard (study streak, difficulty breakdown, confidence calibration, attempt trends).

> ⚠️ The repository currently contains only the client (`client/`), a Next.js app backed by Supabase. The root `package.json` lists Prisma dependencies, but there is no `prisma/` folder anywhere in the repo — if a separate backend is planned, document it in the [Known issues / TODO](#known-issues--todo) section below.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack in dev, Webpack for build)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, Radix UI, lucide-react, framer-motion
- **Data/state:** TanStack Query, Zod
- **Backend services:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`) — auth and database
- **Rich text editor:** Tiptap (material content editor)
- **Monitoring:** Sentry
- **Charts:** Victory
- **Architecture linting:** Steiger + `@feature-sliced/steiger-plugin`
- **CI/CD:** GitHub Actions → Azure Static Web Apps

## Architecture

The client is built following **Feature-Sliced Design (FSD)**:

```
client/
├── app/            # Next.js App Router routes, layouts, pages
├── widgets/         # Large composite page blocks (Navigation, MaterialList, Attempt, Results...)
├── features/        # Individual user actions (create-material, start-attempt, submit-answer, create-tag...)
├── entities/        # Business entities (material, question, tag, attempt, assessment, statistics, auth)
│   └── <entity>/
│       ├── api/      # Requests to Supabase/backend
│       ├── hooks/     # React Query hooks
│       ├── model/     # Types and enums
│       ├── lib/       # Query keys, helper logic
│       └── ui/        # Entity UI components
└── shared/           # Reusable UI components, hooks, config, utilities
```

Adherence to FSD rules (forbidden cross-layer imports, module public APIs, etc.) is enforced automatically by the **Steiger** linter (`client/steiger.config.ts`).

### Key domains

| Entity | Purpose |
|---|---|
| `material` | Study material (link/text), statuses, types, tags |
| `question` | Questions attached to a material: `open` and `options` types |
| `assessment` / `attempt` | Taking a quiz, answers, confidence level |
| `tag` | Tagging materials |
| `statistics` | Progress dashboard: attempt trends, study streak, difficulty, confidence, tag performance |
| `auth` | Authentication via Supabase (magic link, session middleware) |

## Getting started

### Requirements

- Node.js **22.x** (per `client/package.json` → `engines`)
- A Supabase account (URL + anon key)

### Installation

```bash
cd client
npm install
```

### Environment variables

Create `client/.env.local` based on this template:

```env
NEXT_PUBLIC_API_HTTP=
NEXT_PUBLIC_HOME=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SENTRY_AUTH_TOKEN=
```

### Running

```bash
npm run dev      # dev server with Turbopack, http://localhost:3000
npm run build    # production build (Webpack)
npm run start    # run the production build
npm run lint     # ESLint
npm run lint:fsd # check FSD architecture rules (Steiger)
```

## Deployment

The project auto-deploys to **Azure Static Web Apps** via GitHub Actions (`.github/workflows/azure-static-web-apps-*.yml`) on push/PR to `main`: it installs dependencies, caches `node_modules`/`.next/cache`, builds, and deploys the `client` directory.

## Known issues / TODO

- The root `package.json` lists `@prisma/client`/`@prisma/adapter-pg` and references `prisma/schema.prisma`, but the `prisma/` folder itself is missing from the repo — either remove the leftover dependencies or add the corresponding server/schema and document it here.
- There are no automated tests (unit/e2e) in the repository yet — consider adding at least tests for `entities/*/lib` and `shared/lib`.
- `.env*` files are correctly excluded via `.gitignore`, so secrets are not committed to the repo.

## License

ISC (per the root `package.json`).
