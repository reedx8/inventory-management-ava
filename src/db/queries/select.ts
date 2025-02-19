// select queries -- call from /src/app/api folder
import { eq, and, sql, gt, or, isNull, like } from 'drizzle-orm';
import { db } from '../index';
import {
    ordersTable,
    itemsTable,
    storesTable,
    stockTable,
    vendorItemsTable,
    bakeryOrdersTable,
    storeBakeryOrdersTable,
    vendorsTable,
    storeOrdersTable,
    // storeOrdersTable,
} from '../schema';
import { PgColumn } from 'drizzle-orm/pg-core';

// Get each stores daily bakery orders
export async function getStoresBakeryOrders(store_location_id: string | null) {
    if (store_location_id) {
        try {
            const storeId = parseInt(store_location_id);
            const result = await db
                .select({
                    id: storeBakeryOrdersTable.id,
                    name: itemsTable.name,
                    qty_per_order: itemsTable.units,
                    order: storeBakeryOrdersTable.order_qty,
                    // stage: orderStagesTable.stage_name,
                    store_categ: itemsTable.store_categ,
                    // due_date: sql`${dummyDate}`, // dummy data for now
                    // due_date: ordersTable.due_date,
                    store_name: storesTable.name,
                    cron_categ: itemsTable.cron_categ,
                })
                .from(storeBakeryOrdersTable)
                .innerJoin(
                    bakeryOrdersTable,
                    eq(bakeryOrdersTable.id, storeBakeryOrdersTable.order_id)
                )
                .innerJoin(
                    itemsTable,
                    eq(bakeryOrdersTable.item_id, itemsTable.id)
                )
                .innerJoin(
                    storesTable,
                    eq(storesTable.id, storeBakeryOrdersTable.store_id)
                )
                .where(
                    and(
                        eq(storeBakeryOrdersTable.store_id, storeId),
                        eq(itemsTable.is_active, true),
                        // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                        isNull(storeBakeryOrdersTable.submitted_at)
                        // eq(orderStagesTable.stage_name, 'DUE')
                    )
                );

            return {
                success: true,
                error: null,
                data: result,
            };
        } catch (error) {
            const err = error as Error;
            return {
                success: false,
                error: err.message,
                data: null,
            };
        }
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    } else {
        // Return all store items that are DUE (admin view)
        try {
            const result = await db
                .select({
                    id: storeBakeryOrdersTable.id,
                    name: itemsTable.name,
                    qty_per_order: itemsTable.units,
                    order: storeBakeryOrdersTable.order_qty,
                    // stage: orderStagesTable.stage_name,
                    store_categ: itemsTable.store_categ,
                    // due_date: sql`${dummyDate}`, // dummy data for now
                    // due_date: ordersTable.due_date,
                    store_name: storesTable.name,
                    cron_categ: itemsTable.cron_categ,
                })
                .from(storeBakeryOrdersTable)
                .innerJoin(
                    bakeryOrdersTable,
                    eq(bakeryOrdersTable.id, storeBakeryOrdersTable.order_id)
                )
                .innerJoin(
                    itemsTable,
                    eq(itemsTable.id, bakeryOrdersTable.item_id)
                )
                .innerJoin(
                    storesTable,
                    eq(storesTable.id, storeBakeryOrdersTable.store_id)
                )
                .where(
                    and(
                        eq(itemsTable.is_active, true),
                        // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                        isNull(storeBakeryOrdersTable.submitted_at)
                        // eq(orderStagesTable.stage_name, 'DUE')
                    )
                );
            // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

            return {
                success: true,
                error: null,
                data: result,
            };
        } catch (error) {
            const err = error as Error;
            return {
                success: false,
                error: err.message,
                data: null,
            };
        }

        // return result;
    }

    // return result;
}

// Get external vendor orders for each store
export async function getStoreOrders(store_location_id: string | null) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

    if (store_location_id) {
        try {
            const storeId = parseInt(store_location_id);
            const result = await db
                .select({
                    id: storeOrdersTable.id,
                    name: itemsTable.name,
                    qty_per_order: itemsTable.units,
                    order: storeOrdersTable.qty,
                    // stage: orderStagesTable.stage_name,
                    store_categ: itemsTable.store_categ,
                    // due_date: sql`${dummyDate}`, // dummy data for now
                    // due_date: ordersTable.due_date,
                    store_name: storesTable.name,
                    cron_categ: itemsTable.cron_categ,
                })
                .from(storeOrdersTable)
                .innerJoin(
                    ordersTable,
                    eq(storeOrdersTable.order_id, ordersTable.id)
                )
                .innerJoin(itemsTable, eq(ordersTable.item_id, itemsTable.id))
                .innerJoin(
                    storesTable,
                    eq(storesTable.id, storeOrdersTable.store_id)
                )
                .where(
                    and(
                        eq(storeOrdersTable.store_id, storeId),
                        // eq(storeOrdersTable.created_at, sql`<WITHIN THE WEEK>`),
                        eq(itemsTable.is_active, true)
                        // eq(orderStagesTable.stage_name, 'DUE')
                    )
                );
            // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
            return {
                success: true,
                error: null,
                data: result,
            };
        } catch (error) {
            const err = error as Error;
            return {
                success: false,
                error: err.message,
                data: null,
            };
        }
        // return result;
    } else {
        // Return all store items due (admin view)
        try {
            const result = await db
                .select({
                    id: storeOrdersTable.id,
                    name: itemsTable.name,
                    qty_per_order: itemsTable.units,
                    order: storeOrdersTable.qty,
                    // stage: orderStagesTable.stage_name,
                    store_categ: itemsTable.store_categ,
                    // due_date: sql`${dummyDate}`, // dummy data for now
                    // due_date: ordersTable.due_date,
                    store_name: storesTable.name,
                    cron_categ: itemsTable.cron_categ,
                })
                .from(storeOrdersTable)
                .innerJoin(
                    ordersTable,
                    eq(storeOrdersTable.order_id, ordersTable.id)
                )
                .innerJoin(itemsTable, eq(ordersTable.item_id, itemsTable.id))
                .innerJoin(
                    storesTable,
                    eq(storesTable.id, storeOrdersTable.store_id)
                )
                .where(and(eq(itemsTable.is_active, true)));
            // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

            return {
                success: true,
                error: null,
                data: result,
            };
        } catch (error) {
            const err = error as Error;
            return {
                success: false,
                error: err.message,
                data: null,
            };
        }

        // return result;
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
                    eq(itemsTable.is_active, true)
                    // eq(itemsTable.is_weekly_stock, true)
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
                    eq(itemsTable.is_active, true)
                    // eq(itemsTable.is_weekly_stock, true)
                )
            );
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

        return result;
    }

    // return result;
}

// Output empty milk and bread items for store managers to fill in their stock counts
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
        })
        .from(stockTable)
        .innerJoin(itemsTable, eq(itemsTable.id, stockTable.item_id))
        .innerJoin(
            vendorItemsTable,
            eq(vendorItemsTable.item_id, itemsTable.id)
        )
        .innerJoin(storesTable, eq(storesTable.id, stockTable.store_id))
        .where(
            and(
                eq(stockTable.store_id, storeId),
                eq(itemsTable.is_active, true),
                eq(vendorItemsTable.is_active, true),
                isNull(stockTable.submitted_at),
                gt(stockTable.created_at, sql`now() - interval '1 day'`),
                or(
                    eq(itemsTable.cron_categ, 'MILK'),
                    eq(itemsTable.cron_categ, 'BREAD')
                )
            )
        );
    // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    return result;
}

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
        })
        .from(stockTable)
        .innerJoin(itemsTable, eq(itemsTable.id, stockTable.item_id))
        .innerJoin(storesTable, eq(storesTable.id, stockTable.store_id))
        .where(
            and(
                eq(stockTable.store_id, storeId),
                eq(itemsTable.is_active, true),
                eq(itemsTable.is_waste_tracked, true),
                gt(stockTable.created_at, sql`now() - interval '1 day'`)
            )
        );
    // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    return result;
}

// Get active items + today's orders + order > 0 only for bakery staff, either across all stores or for a specific store (store_location_id)
export async function getBakerysOrders(store_location_id?: number | undefined) {
    // TODO; inner join or left join for all store orders?

    let result;
    if (store_location_id) {
        // Get orders for a specific store (bakery's edit btn view)
        try {
            const storeId = store_location_id;
            result = await db
                .select({
                    id: storeBakeryOrdersTable.id,
                    name: itemsTable.name,
                    units: bakeryOrdersTable.units,
                    completed_at: storeBakeryOrdersTable.bakery_completed_at,
                    order_qty: storeBakeryOrdersTable.order_qty,
                    //         order_qty: sql<number>`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`,
                })
                .from(storeBakeryOrdersTable)
                .innerJoin(
                    bakeryOrdersTable,
                    eq(bakeryOrdersTable.id, storeBakeryOrdersTable.order_id)
                )
                .innerJoin(
                    itemsTable,
                    eq(itemsTable.id, bakeryOrdersTable.item_id)
                )
                .where(
                    and(
                        eq(itemsTable.is_active, true),
                        eq(storeBakeryOrdersTable.store_id, storeId),
                        sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                        gt(sql`${storeBakeryOrdersTable.order_qty}::decimal`, 0)
                    )
                );
            // .groupBy(storeBakeryOrdersTable.id, itemsTable.name);
        } catch (error) {
            const err = error as Error;
            return {
                success: false,
                error: err.message,
                data: null,
            };
        }
    } else {
        // Get total orders per item accross all stores (bakery's table view)
        try {
            result = await db
                .select({
                    id: storeBakeryOrdersTable.order_id,
                    name: itemsTable.name,
                    units: bakeryOrdersTable.units,
                    order_qty: sql`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`, // total order qty for item
                    store_data: sql`json_agg(json_build_object('store_name', ${storesTable.name}, 'order_qty', ${storeBakeryOrdersTable.order_qty}))`,
                    // completed_at: storeBakeryOrdersTable.completed_at,
                    // store_data: sql`json_agg(json_build_object('store_id', ${storeBakeryOrdersTable.store_id}, 'order_qty', ${storeBakeryOrdersTable.order_qty}))`,
                    // store_data: (db.select(storeBakeryOrdersTable.store_id, storeBakeryOrdersTable.order_qty).from(storeBakeryOrdersTable)),
                    //         order_qty: sql<number>`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`,
                })
                .from(storeBakeryOrdersTable)
                .innerJoin(
                    bakeryOrdersTable,
                    eq(bakeryOrdersTable.id, storeBakeryOrdersTable.order_id)
                )
                .innerJoin(
                    itemsTable,
                    eq(itemsTable.id, bakeryOrdersTable.item_id)
                )
                .innerJoin(
                    storesTable,
                    eq(storesTable.id, storeBakeryOrdersTable.store_id)
                )
                .where(
                    and(
                        eq(itemsTable.is_active, true),
                        sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`
                    )
                )
                .groupBy(
                    storeBakeryOrdersTable.order_id,
                    itemsTable.name,
                    bakeryOrdersTable.units
                    // storeBakeryOrdersTable.id,
                    // storeBakeryOrdersTable.completed_at
                )
                .having(
                    gt(
                        sql`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`,
                        0
                    )
                );

            // utilizing instead the temp_
            // result = await db
            //     .select({
            //         id: bakeryOrdersTable.id,
            //         name: itemsTable.name,
            //         units: bakeryOrdersTable.units,
            //         completed_at: bakeryOrdersTable.completed_at,
            //         order_qty: sql`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`,
            //         //         order_qty: sql<number>`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`,
            //     })
            //     .from(bakeryOrdersTable)
            //     .leftJoin(
            //         storeBakeryOrdersTable,
            //         eq(bakeryOrdersTable.id, storeBakeryOrdersTable.order_id)
            //     )
            //     .innerJoin(
            //         itemsTable,
            //         eq(itemsTable.id, bakeryOrdersTable.item_id)
            //     )
            //     .where(and(eq(itemsTable.is_active, true)))
            //     .groupBy(bakeryOrdersTable.id, itemsTable.name);
        } catch (error) {
            const err = error as Error;
            return {
                success: false,
                error: err.message,
                data: null,
            };
        }
    }

    return {
        success: true,
        error: null,
        data: result,
    };
}

// search items by name (search bar)
export async function searchItems(query: string) {
    query = query.trim().toLowerCase();

    const result = await db
        .select({
            id: itemsTable.id,
            name: itemsTable.name,
            vendor_name: vendorsTable.name,
            units: itemsTable.units,
            store_categ: itemsTable.store_categ,
            item_description: itemsTable.item_description,
            is_active: itemsTable.is_active,
            email: vendorsTable.email,
            phone: vendorsTable.phone,
            categ: itemsTable.cron_categ,
            // due_date: sql`${dummyDate}`, // dummy data for now
        })
        .from(itemsTable)
        .innerJoin(vendorsTable, eq(vendorsTable.id, itemsTable.vendor_id))
        .where(like(lower(itemsTable.name), `%${query}%`));

    return result;
}

// custom lower function
export function lower(name: PgColumn) {
    return sql`lower(${name})`;
}
