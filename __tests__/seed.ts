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
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
config({ path: '.env' });

const TEST_CONNECTION_STRING = process.env.TEST_DATABASE_URL;
if (!TEST_CONNECTION_STRING) {
    console.error('TEST_DATABASE_URL environment variable is not set');
    process.exit(1);
}
const TEST_DB = drizzle(TEST_CONNECTION_STRING!);

async function main() {
    // should run in this order due to deletions
    // seedItemsVendorsTables();
    seedTodaysDailyBakery();
    // seedVendorsTable();
}

// Seed daily bakery orders tables with todays orders, replicate cron job
async function seedTodaysDailyBakery() {
    await clearTable(schema.storeBakeryOrdersTable);
    await clearTable(schema.bakeryOrdersTable);

    // Get the current date and set the time to between 5 and 6 AM
    const today = new Date();
    today.setHours(5); // Set to 5 AM
    today.setMinutes(Math.floor(Math.random() * 60)); // Random minutes between 0-59
    today.setSeconds(Math.floor(Math.random() * 60)); // Random seconds between 0-59

    // Create the max date (6 AM same day)
    const todayMax = new Date(today);
    todayMax.setHours(6);
    todayMax.setMinutes(0);
    todayMax.setSeconds(0);

    const storeDate = new Date();
    storeDate.setHours(9); // Set to 9 AM

    const storeDateMax = new Date(storeDate);
    storeDateMax.setHours(10);
    storeDateMax.setMinutes(0);
    storeDateMax.setSeconds(0);

    const numOfOrders = 15;

    // randomly seed bakery_orders table with drizzle-seed
    await seed(TEST_DB, {
        bakeryOrders: schema.bakeryOrdersTable,
    }).refine((f) => ({
        bakeryOrders: {
            columns: {
                item_id: f.int({ minValue: 1, maxValue: 40, isUnique: true }), // TODO:
                units: f.valuesFromArray({
                    values: UNITS,
                }), // cron job should copy items.units to bakeryOrders.units
                group_order_no: f.valuesFromArray({ values: [1] }),
                created_at: f.date({ minDate: today, maxDate: todayMax }), // create order between 5 and 6 AM today to mimic cron job
                completed_at: f.valuesFromArray({ values: [undefined] }),
                bakery_comments: f.valuesFromArray({ values: [undefined] }),
                temp_tot_made: f.valuesFromArray({ values: [0] }), // satisfies field's positive num check constraint
                temp_tot_order_qty: f.valuesFromArray({ values: [0] }),
                is_checked_off: f.valuesFromArray({ values: [false] }),
            },
            count: numOfOrders, // an order for each item
        },
    }));

    // manually seed store_bakery_orders table instead due to drizzle-seed's lack of support for row-level seeding
    // row-level seeding needed since i need a very specific pattern per storeBakeryOrder.order_id: store_id 1,2,3,4
    for (let i = 1; i <= numOfOrders; ++i) {
        for (let id = 1; id <= STORES.length; ++id) {
            await TEST_DB.insert(schema.storeBakeryOrdersTable).values({
                order_id: i,
                store_id: id,
                // order_qty: sql`floor(random() * 20 + 1)`, // generate a random integer between 1 and 20 (inclusive)
                is_par_submit: false,
                // created_at: sql`now()`,
                created_at: today,
            });
        }
    }
}

// async function seedStoreBakeryOrdersTable(bakeryOrderIds: number) {
//     let i = 1;
//     const store_id = [1, 2, 3, 4, 5];

//     // Makes (bakeryOrderIds x store_id.length) store bakery orders in total
//     while (i <= bakeryOrderIds) {
//         for (const s of store_id) {
//             await seed(TEST_DB, {
//                 storeBakeryOrders: schema.storeBakeryOrdersTable,
//             }).refine((f) => ({
//                 storeBakeryOrders: {
//                     columns: {
//                         order_id: f.valuesFromArray({ values: [i] }),
//                         store_id: f.valuesFromArray({ values: [s] }),
//                         order_qty: f.int({ minValue: 0, maxValue: 20 }),
//                         made_qty: f.valuesFromArray({ values: [undefined] }),
//                         is_par_submit: f.valuesFromArray({ values: [false] }),
//                         comments: f.valuesFromArray({ values: [undefined] }),
//                         created_at: f.date({
//                             minDate: today,
//                             maxDate: todayMax,
//                         }),
//                         submitted_at: f.date({
//                             minDate: storeDate,
//                             maxDate: storeDateMax,
//                         }),
//                         bakery_completed_at: undefined,
//                     },
//                 },
//             }));
//         }
//         i++;
//     }
// }

// drizzle-seed lacks support for row-level seeding. Instead, we use raw SQL commands to seed table
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function seedStoresTable() {
    // Ensures match with production's stores table (necessary)
    for (let i = 0; i < STORES.length; ++i) {
        await TEST_DB.insert(schema.storesTable).values({
            id: i + 1,
            name: STORES[i],
            weekly_budget: sql`random() * 3000 + 500`,
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function seedVendorsTable() {
    await seed(TEST_DB, { vendors: schema.vendorsTable }).refine((f) => ({
        vendors: {
            columns: {
                name: f.companyName({ isUnique: true }),
                phone: f.phoneNumber({ template: '(###) ###-####' }),
                email: f.email(),
                comments: f.loremIpsum({ sentencesCount: 3 }),
                contact_name: f.firstName(),
            },
        },
    }));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function seedItemsVendorsTables() {
    await clearTable(schema.itemsTable);
    await clearTable(schema.vendorsTable);

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
                phone: f.phoneNumber({ template: '(###) ###-####' }),
                email: f.email(),
                comments: f.loremIpsum({ sentencesCount: 3 }),
                contact_name: f.firstName(),
                is_active: f.valuesFromArray({ values: [true] }),
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
                is_active: f.valuesFromArray({ values: [true] }),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function clearTable(table: PgTableWithColumns<any>) {
    await TEST_DB.delete(table);
}

main();
// clearAllTables();
