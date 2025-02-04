// select queries -- call from /src/app/api folder
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../index';
import {
    ordersTable,
    itemsTable,
    storesTable,
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
                qty_per_order: ordersTable.qty_per_order,
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
                qty_per_order: ordersTable.qty_per_order,
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
