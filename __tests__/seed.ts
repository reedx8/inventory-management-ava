import { drizzle } from 'drizzle-orm/node-postgres';
import { seed, reset } from 'drizzle-seed';
// import * as schema from '@/db/schema';
import {
    bakeryOrdersTable,
    itemsTable,
    vendorItemsTable,
    storesTable,
    stockTable,
    ordersTable,
    storeBakeryOrdersTable,
    vendorsTable,
} from '@/db/schema';
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
import { eq, or, sql, and } from 'drizzle-orm';
config({ path: '.env' });

const TEST_CONNECTION_STRING = process.env.TEST_DATABASE_URL;
if (!TEST_CONNECTION_STRING) {
    console.error('TEST_DATABASE_URL environment variable is not set');
    process.exit(1);
}
const TEST_DB = drizzle(TEST_CONNECTION_STRING!);

const order_qtys = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2.5, 3, 3.5, 4, 4, 4, 5, 5,
    5.5, 6, 7, 7.5, 8, 8, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13, 13.5,
    14, 14.5, 15, 15,
];
// const order_qtys = [
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2,
//     2.5, 3, 3.5, 4,
// ];

async function main() {
    // seedItemsVendorsTables(); // Items and vendors table need to be seeded first
    seedTodaysDailyBakeryOrders(false); // then you can do storeBakeryOrders and bakeryOrders
    // seedVendorsTable();
    // seedMilkBreadStock(true, false);
}

// seed milk bread stock/stock orders for either order managers (stock orders) or store managers (stock)
// async function seedMilkBreadStock(isMonday: boolean, forStoreMngrs: boolean) {
//     await clearTable(schema.ordersTable); // just to clear any connected order records made during milk/bread submission
//     await clearTable(schema.stockTable);

//     if (forStoreMngrs) {
//         return;
//     }
//     // else for order managers that follows, fill in random stock counts:
//     let milkBreadItems: { id: number; units: string | null }[] = [];

//     if (isMonday) {
//         // if monday, grab both milk and bread items
//         milkBreadItems = await TEST_DB.select({
//             id: schema.itemsTable.id,
//             units: schema.vendorItemsTable.units,
//         })
//             .from(schema.itemsTable)
//             .leftJoin(
//                 schema.vendorItemsTable,
//                 eq(schema.itemsTable.id, schema.vendorItemsTable.item_id)
//             )
//             .where(
//                 and(
//                     eq(schema.itemsTable.is_active, true),
//                     or(
//                         eq(schema.itemsTable.cron_categ, 'MILK'),
//                         eq(schema.itemsTable.cron_categ, 'BREAD')
//                     )
//                 )
//             );
//     } else {
//         // if not monday, then it's for thursday, so only grab milk items
//         milkBreadItems = await TEST_DB.select({
//             id: schema.itemsTable.id,
//             units: schema.vendorItemsTable.units,
//         })
//             .from(schema.itemsTable)
//             .leftJoin(
//                 schema.vendorItemsTable,
//                 eq(schema.itemsTable.id, schema.vendorItemsTable.item_id)
//             )
//             .where(
//                 and(
//                     eq(schema.itemsTable.is_active, true),
//                     eq(schema.itemsTable.cron_categ, 'MILK')
//                 )
//             );
//     }

//     // mirrors insert logic in insert.ts
//     for (let id = 1; id <= STORES.length; ++id) {
//         for (const item of milkBreadItems) {
//             const stockTableInsert = await TEST_DB.insert(schema.stockTable)
//                 .values({
//                     item_id: item.id,
//                     store_id: id,
//                     count: String(Math.floor(Math.random() * 10)),
//                     units: item.units,
//                     submitted_at: sql`now()`,
//                 })
//                 .returning({ id: schema.stockTable.id });

//             await TEST_DB.insert(schema.ordersTable).values({
//                 item_id: item.id,
//                 store_id: id,
//                 stock_id: stockTableInsert[0].id,
//                 units: item.units,
//                 store_submit_at: sql`now()`,
//             });
//         }
//     }
// }

// Seed daily bakery orders tables with todays orders, replicate cron job
// forBakery = true if want orders ready for bakery, false if orders ready for stores
async function seedTodaysDailyBakeryOrders(forBakery: boolean = false) {
    await clearTable(storeBakeryOrdersTable);
    await clearTable(bakeryOrdersTable);
    // await clearTable(schema.storeBakeryOrdersTable);
    // await clearTable(schema.bakeryOrdersTable);

    // Get the current date and set the time to 4 AM (mimics current cron job)
    const today = new Date();
    // today.setDate(today.getDate() - 1); // yesterday
    today.setHours(4); // Set to 4 AM
    today.setMinutes(0); // Set to 0 minutes
    today.setSeconds(0); // Set to 0 seconds
    // today.setMinutes(Math.floor(Math.random() * 60)); // Random minutes between 0-59
    // today.setSeconds(Math.floor(Math.random() * 60)); // Random seconds between 0-59

    // Create the max date (6 AM same day)
    // const todayMax = new Date(today);
    // todayMax.setHours(6);
    // todayMax.setMinutes(0);
    // todayMax.setSeconds(0);

    const storeDate = new Date();
    storeDate.setHours(9); // Set to 9 AM
    storeDate.setMinutes(0);
    storeDate.setSeconds(0);

    // const storeDateMax = new Date(storeDate);
    // storeDateMax.setHours(10);
    // storeDateMax.setMinutes(0);
    // storeDateMax.setSeconds(0);

    // type BakeryOrderInsert = typeof bakeryOrdersTable.$inferInsert;
    // const test: BakeryOrderInsert = {
    //     item_id: 1,
    //     units: '1',
    //     group_order_no: 1,
    //     created_at: today,
    //     temp_tot_made: String(0),
    // };

    // const numOfOrders = forBakery ? 38 : 38;

    const pastryItems = await TEST_DB.select({
        id: itemsTable.id,
        units: itemsTable.units,
    })
        .from(itemsTable)
        .where(
            and(
                eq(itemsTable.cron_categ, 'PASTRY'),
                eq(itemsTable.is_active, true)
            )
        );

    for (const item of pastryItems) {
        const bakeryOrder = await TEST_DB.insert(bakeryOrdersTable)
            .values({
                item_id: item.id,
                units: item.units,
                group_order_no: 1,
                created_at: today,
                temp_tot_made: String(0), // for some reason these need to be strings
                temp_tot_order_qty: String(0),
                is_checked_off: false,
                completed_at: undefined,
                bakery_comments: undefined,
            })
            .returning({ id: bakeryOrdersTable.id });

        for (let s = 1; s <= STORES.length; ++s) {
            await TEST_DB.insert(storeBakeryOrdersTable).values({
                order_id: bakeryOrder[0].id,
                store_id: s,
                is_par_submit: false,
                created_at: today,
                order_qty: forBakery
                    ? String(
                          order_qtys[
                              Math.floor(Math.random() * order_qtys.length)
                          ]
                      )
                    : undefined,
                submitted_at: forBakery ? storeDate : undefined,
            } as any);
        }
    }

    // randomly seed bakery_orders table with drizzle-seed
    // await seed(TEST_DB, {
    //     bakeryOrders: schema.bakeryOrdersTable,
    // }).refine((f) => ({
    //     bakeryOrders: {
    //         columns: {
    //             item_id: f.int({ minValue: 14, maxValue: 51, isUnique: true }), // id's 14-51 = pastry items
    //             // item_id: f.valuesFromArray({
    //             //     values: Array.from({ length: 38 }, (_, i) => i + 14),
    //             //     isUnique: true,
    //             // }),
    //             units: f.valuesFromArray({
    //                 values: UNITS, // TODO; should seed with items.units instead
    //             }), // cron job should copy items.units to bakeryOrders.units
    //             group_order_no: f.valuesFromArray({ values: [1] }),
    //             created_at: f.date({ minDate: today, maxDate: today }),
    //             // created_at: f.date({ minDate: today, maxDate: todayMax }), // create order between 4 and 5 AM today to mimic cron job
    //             completed_at: f.valuesFromArray({ values: [undefined] }),
    //             bakery_comments: f.valuesFromArray({ values: [undefined] }),
    //             temp_tot_made: f.valuesFromArray({ values: [0] }), // satisfies field's positive num check constraint
    //             temp_tot_order_qty: f.valuesFromArray({ values: [0] }),
    //             is_checked_off: f.valuesFromArray({ values: [false] }),
    //         },
    //         count: numOfOrders, // an order for each item
    //     },
    // }));

    // // manually seed store_bakery_orders table instead due to drizzle-seed's lack of support for row-level seeding
    // // row-level seeding needed since i need a very specific pattern per storeBakeryOrder.order_id: store_id 1,2,3,4
    // for (let i = 1; i <= numOfOrders; ++i) {
    //     for (let id = 1; id <= STORES.length; ++id) {
    //         await TEST_DB.insert(schema.storeBakeryOrdersTable).values({
    //             order_id: i,
    //             store_id: id,
    //             is_par_submit: false,
    //             // created_at: sql`now()`,
    //             created_at: today,
    //             order_qty: forBakery
    //                 ? String(
    //                       order_qtys[
    //                           Math.floor(Math.random() * order_qtys.length)
    //                       ]
    //                   )
    //                 : undefined,
    //             // order_qty: forBakery
    //             //     ? String(Math.floor(Math.random() * 10))
    //             //     : undefined,
    //             // order_qty: sql`floor(random() * 20 + 1)`, // generate a random integer between 1 and 20 (inclusive)
    //             submitted_at: forBakery ? storeDate : undefined,
    //         });
    //     }
    // }
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
// async function seedStoresTable() {
//     // Ensures match with production's stores table (necessary)
//     for (let i = 0; i < STORES.length; ++i) {
//         await TEST_DB.insert(schema.storesTable).values({
//             id: i + 1,
//             name: STORES[i],
//             weekly_budget: sql`random() * 3000 + 500`,
//         });
//     }
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function seedVendorsTable() {
//     await seed(TEST_DB, { vendors: schema.vendorsTable }).refine((f) => ({
//         vendors: {
//             columns: {
//                 name: f.companyName({ isUnique: true }),
//                 phone: f.phoneNumber({ template: '(###) ###-####' }),
//                 email: f.email(),
//                 comments: f.loremIpsum({ sentencesCount: 3 }),
//                 contact_name: f.firstName(),
//             },
//         },
//     }));
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function seedItemsVendorsTables() {
//     await clearTable(schema.itemsTable);
//     await clearTable(schema.vendorsTable);

//     await seed(TEST_DB, {
//         items: schema.itemsTable,
//         vendors: schema.vendorsTable,
//     }).refine((f) => ({
//         vendors: {
//             count: 5,
//             with: {
//                 items: 5, // every vendor generates 5 items
//             },
//             columns: {
//                 name: f.companyName({ isUnique: true }),
//                 phone: f.phoneNumber({ template: '(###) ###-####' }),
//                 email: f.email(),
//                 comments: f.loremIpsum({ sentencesCount: 3 }),
//                 contact_name: f.firstName(),
//                 is_active: f.valuesFromArray({ values: [true] }),
//             },
//         },
//         items: {
//             columns: {
//                 // vendor_id: f.int({ minValue: 1, maxValue: 5 }),
//                 name: f.valuesFromArray({
//                     values: ITEMS,
//                 }),
//                 units: f.valuesFromArray({
//                     values: UNITS,
//                 }),
//                 list_price: f.number({
//                     minValue: 0,
//                     maxValue: 50,
//                     precision: 2,
//                 }),
//                 store_categ: f.valuesFromArray({
//                     values: STORE_CATEG,
//                 }),
//                 cron_categ: f.valuesFromArray({
//                     values: CRON_CATEG,
//                 }),
//                 invoice_categ: f.valuesFromArray({
//                     values: INVOICE_CATEG,
//                 }),
//                 item_description: f.loremIpsum({ sentencesCount: 1 }),
//                 vendor_description: f.loremIpsum({ sentencesCount: 2 }),
//                 is_active: f.valuesFromArray({ values: [true] }),
//             },
//             // count: 35,
//         },
//     }));
// }

// Clear all tables in test db
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function clearAllTables() {
//     // const db = drizzle(TEST_DB_STRING!);
//     await reset(TEST_DB, schema);
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function clearTable(table: PgTableWithColumns<any>) {
    await TEST_DB.delete(table);
}

main();
// clearAllTables();
