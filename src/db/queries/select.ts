// select queries

import { eq, and } from 'drizzle-orm';
import { db } from '../index';
import { ordersTable, storeItemsTable, itemsTable } from '../schema';

// Get active store items that are DUE for a specific store
export async function getStoreOrders(storeId: number) {
    const result = await db
        .select({
            name: itemsTable.name,
            qty_per_order: ordersTable.qty_per_order,
            order: ordersTable.qty_submitted,
            status: ordersTable.status,
            store_categ: storeItemsTable.store_categ,
        })
        .from(ordersTable)
        .innerJoin(storeItemsTable, eq(ordersTable.item_id, storeItemsTable.id))
        .innerJoin(itemsTable, eq(storeItemsTable.item_id, itemsTable.id))
        .where(
            and(
                eq(storeItemsTable.store_id, storeId),
                eq(storeItemsTable.active, true),
                eq(ordersTable.status, 'DUE')
            )
        );
    // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

    // if (error) {
    //     console.error(error);
    // }
    return result;
}
