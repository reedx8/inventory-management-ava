# IMS

-   AVA Roasteria's Inventory Management System (IMS).
-   React / Next.js / TypeScript / Drizzle ORM / Supabase / Tailwind project.

## Getting Started

1. Clone repo
2. `cd` to project folder and run `git config core.hooksPath .githooks` to set up the project's git hooks. See `.githooks/pre-push` for more details.
3. Create `.env` and `.env.local` files in project's parent folder (message repo owner for file contents)
4. Run `npm i`
5. Finally, run `npm run dev:test` to start test server, and open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Note: you will need the correct .env/.env.local files to run the app.

## CI/CD workflows

After getting started, refer to the following. See `package.json` for more details.

### Development and Production

-   `npm run dev` to start dev server with production DB.
-   `npm run dev:test` to start test server with test DB.
-   `npm run build` to build production bundle
-   `npm run start` to start production server
-   Pushing to repo's main branch will trigger CI/CD workflow to deploy to production on Netlify.

### Testing

-   `npm run dev:test` to run app while manually testing against test DB.
-   Tests (and build) will automatically run before any direct push to main branch via `.githooks/pre-push` file.

### Migration

Production/dev db and test db use the same schema. Keep DB schemas in sync for now.

1. `npm run gen:dev` / `npm run gen:test` to generate migration files after schema.ts change for both production and test DBs.
2. `npm run push:dev` / `npm run push:test` to push migration files to both dev/production and test DBs.

## Tooling / Resources
