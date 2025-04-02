import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
    schema: './src/db/schema.ts', // Schema is typically the same
    out: './supabase/test-migrations', // Separate folder for test migrations
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.TEST_DATABASE_URL!, // Test-specific connection string
    },
});
