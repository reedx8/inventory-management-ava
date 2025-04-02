// db configurations for drizzle utility function queries
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const connectionString =
    process.env.APP_ENV === 'test'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;

const client = postgres(connectionString!);
// const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
