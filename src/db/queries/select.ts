// select queries -- call from /src/app/api folder
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { ordersTable, storeItemsTable, itemsTable } from '../schema';

// Get active store items that are DUE for a specific store (storeId)
export async function getStoreOrders(store_location_id: string | null) {
    const dummyDate: string = '2025-06-15'; // dummy data for now

    if (store_location_id) {
        const storeId = parseInt(store_location_id);
        const result = await db
            .select({
                id: ordersTable.id,
                name: itemsTable.name,
                qty_per_order: ordersTable.qty_per_order,
                order: ordersTable.qty_submitted,
                status: ordersTable.status,
                store_categ: storeItemsTable.store_categ,
                due_date: sql`${dummyDate}`, // dummy data for now
            })
            .from(ordersTable)
            .innerJoin(
                storeItemsTable,
                eq(ordersTable.item_id, storeItemsTable.id)
            )
            .innerJoin(itemsTable, eq(storeItemsTable.item_id, itemsTable.id))
            .where(
                and(
                    eq(storeItemsTable.store_id, storeId),
                    eq(storeItemsTable.active, true),
                    eq(ordersTable.status, 'DUE')
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        return result;
    } else {
        const result = await db
            .select({
                id: ordersTable.id,
                name: itemsTable.name,
                qty_per_order: ordersTable.qty_per_order,
                order: ordersTable.qty_submitted,
                status: ordersTable.status,
                store_categ: storeItemsTable.store_categ,
                due_date: sql`${dummyDate}`, // dummy data for now
                // TODO: return store id for admin view
            })
            .from(ordersTable)
            .innerJoin(
                storeItemsTable,
                eq(ordersTable.item_id, storeItemsTable.id)
            )
            .innerJoin(itemsTable, eq(storeItemsTable.item_id, itemsTable.id))
            .where(
                and(
                    eq(ordersTable.status, 'DUE'),
                    eq(storeItemsTable.active, true)
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

        return result;
    }

    // return result;
}
