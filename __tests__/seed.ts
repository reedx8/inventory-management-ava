import { drizzle } from 'drizzle-orm/node-postgres';
import { seed, reset } from 'drizzle-seed';
import * as schema from '@/db/schema';
import {
    ITEMS,
    INVOICE_CATEG,
    STORE_CATEG,
    CRON_CATEG,
    UNITS,
    STORES,
} from './test-data';
import { config } from 'dotenv';
config({ path: '.env' });

const TEST_CONNECTION_STRING = process.env.TEST_DATABASE_URL;
if (!TEST_CONNECTION_STRING) {
    console.error('TEST_DATABASE_URL environment variable is not set');
    process.exit(1);
}
const TEST_DB = drizzle(TEST_CONNECTION_STRING!);

async function main() {
    // seedStoresTable();
    seedItemsVendorsTables();
    // seedVendorsTable();
}

// Seed only stores table for manual testing (eg npm run seed:test)
async function seedStoresTable() {
    // Seed table with default setup but with weekly_budget column between 0 and 5000 IOT respect column's check constraint
    await seed(TEST_DB, { stores: schema.storesTable }).refine((f) => ({
        stores: {
            columns: {
                name: f.valuesFromArray({
                    values: STORES,
                    isUnique: true,
                }),
                weekly_budget: f.number({
                    minValue: 500,
                    maxValue: 4000,
                    precision: 2,
                }),
            },
            count: STORES.length,
        },
    }));
}

async function seedVendorsTable() {
    await seed(TEST_DB, { vendors: schema.vendorsTable }).refine((f) => ({
        vendors: {
            columns: {
                name: f.companyName({ isUnique: true }),
                phone: f.phoneNumber(),
                email: f.email(),
                comments: f.loremIpsum({ sentencesCount: 3 }),
                contact_name: f.firstName(),
            },
        },
    }));
}

async function seedItemsVendorsTables() {
    const dividor = 5;

    await seed(TEST_DB, {
        items: schema.itemsTable,
        vendors: schema.vendorsTable,
    }).refine((f) => ({
        vendors: {
            count: 5,
            with: {
                items: 5, // every vendor generates 5 items
            },
            columns: {
                name: f.companyName({ isUnique: true }),
                phone: f.phoneNumber(),
                email: f.email(),
                comments: f.loremIpsum({ sentencesCount: 3 }),
                contact_name: f.firstName(),
            },
        },
        items: {
            columns: {
                // vendor_id: f.int({ minValue: 1, maxValue: 5 }),
                name: f.valuesFromArray({
                    values: ITEMS,
                }),
                units: f.valuesFromArray({
                    values: UNITS,
                }),
                list_price: f.number({
                    minValue: 0,
                    maxValue: 50,
                    precision: 2,
                }),
                store_categ: f.valuesFromArray({
                    values: STORE_CATEG,
                }),
                cron_categ: f.valuesFromArray({
                    values: CRON_CATEG,
                }),
                invoice_categ: f.valuesFromArray({
                    values: INVOICE_CATEG,
                }),
                item_description: f.loremIpsum({ sentencesCount: 1 }),
                vendor_description: f.loremIpsum({ sentencesCount: 2 }),
            },
            // count: 35,
        },
    }));
}

// Clear all tables in test db
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function clearAllTables() {
    // const db = drizzle(TEST_DB_STRING!);
    await reset(TEST_DB, schema);
}

main();
// clearAllTables();
