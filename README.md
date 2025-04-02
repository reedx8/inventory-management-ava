# Ava Roasteria

Ava Roasteria's inventory management system. A React / Next.js / TypeScript / Drizzle / Supabase project.

## Getting Started

1. Clone repo
2. Create `.env` and `.env.local` files in project's parent folder (message repo owner for `.env` contents)
3. Run `npm i`
4. Finally, run `npm run dev` to start dev server, and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## CI/CD workflows

After getting started, refer to the following. See `package.json` for more details.

### Development and Production

-   `npm run dev` to start dev server with production/dev DB.
-   `npm run build` to build production bundle
-   `npm run start` to start production server
-   Pushing to repo's main branch will trigger CI/CD workflow to deploy to production on Netlify.

### Testing

-   `npm run dev:test` to run app while manually testing against test DB.
-   Automated testing coming soon (via `npm run test`)

#### Migration

Production/dev db and test db use the same schema. Keep DB schemas in sync for now.

1. `npm run gen` to generate migration files after schema.ts change for both dev and test DBs.
2. `npm run push` to push migration files to both dev/production and test DBs.

## Tooling / Resources
