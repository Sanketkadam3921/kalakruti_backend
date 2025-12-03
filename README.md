# Interior Design Website — API (Minimal)

This backend exposes only the delivered projects endpoints.

## Base URL
`/api/projects`

## Endpoints

1) GET `/projects/delivered`
- Returns all delivered (completed) projects
- 200: list of projects, 404: none found

2) GET `/projects/delivered/:id`
- Returns details for a specific delivered project
- 200: project details, 404: not found

## Quick Setup

1. Install deps
```bash
cd backend && npm install
```

2. Configure DB
```bash
cp .env.example .env
# Ensure DATABASE_URL matches your Postgres instance
```

3. Init DB
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. Run
```bash
npm run dev
# Health: http://localhost:5000/health
```

## Schema (Prisma)
- `Project` (only COMPLETED supported)
- `ProjectImage`

Note: Only image URLs are stored (paths/URLs), not binary files.

