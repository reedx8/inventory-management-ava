// select queries -- call from /src/app/api folder
import { eq, and, sql, gt, or } from 'drizzle-orm';
import { db } from '../index';
import {
    ordersTable,
    itemsTable,
    storesTable,
    stockTable,
    vendorItemsTable,
    // storeOrdersTable,
} from '../schema';

// Get only active items that are due for a specific store (storeId)
export async function getStoreOrders(store_location_id: string | null) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

    if (store_location_id) {
        const storeId = parseInt(store_location_id);
        const result = await db
            .select({
                id: ordersTable.id,
                name: itemsTable.name,
                qty_per_order: itemsTable.units,
                order: sql`0::integer`,
                // stage: orderStagesTable.stage_name,
                store_categ: itemsTable.store_categ,
                // due_date: sql`${dummyDate}`, // dummy data for now
                due_date: ordersTable.due_date,
                store_name: storesTable.name,
            })
            .from(ordersTable)
            .innerJoin(itemsTable, eq(ordersTable.item_id, itemsTable.id))
            .innerJoin(storesTable, eq(storesTable.id, ordersTable.store_id))
            .where(
                and(
                    eq(ordersTable.store_id, storeId),
                    eq(itemsTable.is_active, true)
                    // eq(orderStagesTable.stage_name, 'DUE')
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        return result;
    } else {
        // Return all store items that are DUE
        const result = await db
            .select({
                id: ordersTable.id,
                name: itemsTable.name,
                qty_per_order: itemsTable.units,
                // order: orderStagesTable.order_qty,
                // stage: orderStagesTable.stage_name,
                store_categ: itemsTable.store_categ,
                // due_date: sql`${dummyDate}`, // dummy data for now
                due_date: ordersTable.due_date,
                store_name: storesTable.name,
            })
            .from(ordersTable)
            .innerJoin(itemsTable, eq(itemsTable.id, ordersTable.item_id))
            .innerJoin(storesTable, eq(storesTable.id, ordersTable.store_id))
            .where(and(eq(itemsTable.is_active, true)));
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

        return result;
    }

    // return result;
}

export async function getWeeklyStock(store_location_id: string | null) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

    if (store_location_id) {
        const storeId = parseInt(store_location_id);
        const result = await db
            .select({
                id: stockTable.id,
                name: itemsTable.name,
                units: itemsTable.units,
                count: sql`0::integer`,
                store_categ: itemsTable.store_categ,
                // due_date: sql`${dummyDate}`, // dummy data for now
                due_date: stockTable.due_date,
                store_name: storesTable.name,
            })
            .from(stockTable)
            .innerJoin(itemsTable, eq(itemsTable.id, stockTable.item_id))
            .innerJoin(storesTable, eq(storesTable.id, stockTable.store_id))
            .where(
                and(
                    eq(stockTable.store_id, storeId),
                    eq(itemsTable.is_active, true),
                    eq(itemsTable.is_weekly_stock, true)
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        return result;
    } else {
        // Return ALL stock items
        const result = await db
            .select({
                id: stockTable.id,
                name: itemsTable.name,
                units: itemsTable.units,
                count: sql`0::integer`,
                store_categ: itemsTable.store_categ,
                // due_date: sql`${dummyDate}`, // dummy data for now
                due_date: stockTable.due_date,
                store_name: storesTable.name,
            })
            .from(stockTable)
            .innerJoin(itemsTable, eq(itemsTable.id, stockTable.item_id))
            .innerJoin(storesTable, eq(storesTable.id, stockTable.store_id))
            .where(
                and(
                    eq(itemsTable.is_active, true),
                    eq(itemsTable.is_weekly_stock, true)
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

        return result;
    }

    // return result;
}


export async function getMilkBreadStock(store_location_id: string) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

        const storeId = parseInt(store_location_id);
        const result = await db
            .select({
                id: stockTable.id,
                itemName: itemsTable.name,
                nameFromVendor: vendorItemsTable.item_name,
                units: vendorItemsTable.units,
                count: sql`0::integer`,
                // store_name: storesTable.name,
            }).from(stockTable)
            .innerJoin(itemsTable, eq(itemsTable.id, stockTable.item_id))
            .innerJoin(vendorItemsTable, eq(vendorItemsTable.item_id, itemsTable.id))
            .innerJoin(storesTable, eq(storesTable.id, stockTable.store_id))
            .where(
                and(
                    eq(stockTable.store_id, storeId),
                    eq(itemsTable.is_active, true),
                    eq(vendorItemsTable.is_active, true),
                    gt(stockTable.created_at, sql`now() - interval '2 days'`),
                    or(
                        eq(itemsTable.cron_categ, 'MILK'),
                        eq(itemsTable.cron_categ, 'BREAD')
                    )
                ),
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        return result;
};

export async function getWasteStock(store_location_id: string) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

        const storeId = parseInt(store_location_id);
        const result = await db
            .select({
                id: stockTable.id,
                name: itemsTable.name,
                units: itemsTable.units,
                count: sql`0::integer`,
                // store_name: storesTable.name,
            }).from(stockTable)
            .innerJoin(itemsTable, eq(itemsTable.id, stockTable.item_id))
            .innerJoin(storesTable, eq(storesTable.id, stockTable.store_id))
            .where(
                and(
                    eq(stockTable.store_id, storeId),
                    eq(itemsTable.is_active, true),
                    eq(itemsTable.is_waste_tracked, true),
                    gt(stockTable.created_at, sql`now() - interval '2 days'`),
                ),
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        return result;
};