// select queries -- call from /src/app/api folder
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { ordersTable, itemsTable, orderStagesTable } from '../schema';

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
                order: orderStagesTable.order_qty,
                stage: orderStagesTable.stage_name,
                store_categ: itemsTable.store_categ,
                due_date: sql`${dummyDate}`, // dummy data for now
            })
            .from(ordersTable)
            .innerJoin(itemsTable, eq(ordersTable.item_id, itemsTable.id))
            .innerJoin(
                orderStagesTable,
                eq(orderStagesTable.order_id, ordersTable.id)
            )
            .where(
                and(
                    eq(ordersTable.store_id, storeId),
                    eq(itemsTable.is_active, true),
                    eq(orderStagesTable.stage_name, 'DUE')
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
                order: orderStagesTable.order_qty,
                stage: orderStagesTable.stage_name,
                store_categ: itemsTable.store_categ,
                due_date: sql`${dummyDate}`, // dummy data for now
                // TODO: return store id for admin view
            })
            .from(ordersTable)
            .innerJoin(itemsTable, eq(itemsTable.id, ordersTable.item_id))
            .innerJoin(
                orderStagesTable,
                eq(orderStagesTable.order_id, ordersTable.id)
            )
            .where(
                and(
                    eq(orderStagesTable.stage_name, 'DUE'),
                    eq(itemsTable.is_active, true)
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

        return result;
    }

    // return result;
}
