// select queries -- call from /src/app/api folder
import { eq, and, sql, gt, or, isNull, like, asc, count } from 'drizzle-orm';
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
    parsTable,
    // storeOrdersTable,
} from '../schema';
import { PgColumn } from 'drizzle-orm/pg-core';
import { config } from 'dotenv';
config({ path: '.env' });

// Get each store's daily bakery orders (store -> orders due page)
export async function getStoresBakeryOrders(
    store_location_id: string | null,
    dow: number
) {
    const day = getDaysName(dow);

    if (store_location_id) {
        try {
            const storeId = parseInt(store_location_id);
            const result = await queryWithAuthRole(async (tx) => {
                return await tx
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
                        pars_value: sql`${
                            parsTable[day as keyof typeof parsTable]
                        }`,
                    })
                    .from(storeBakeryOrdersTable)
                    .innerJoin(
                        bakeryOrdersTable,
                        eq(
                            bakeryOrdersTable.id,
                            storeBakeryOrdersTable.order_id
                        )
                    )
                    .innerJoin(
                        itemsTable,
                        eq(bakeryOrdersTable.item_id, itemsTable.id)
                    )
                    .innerJoin(
                        storesTable,
                        eq(storesTable.id, storeBakeryOrdersTable.store_id)
                    )
                    .innerJoin(parsTable, eq(parsTable.item_id, itemsTable.id))
                    .where(
                        and(
                            eq(storeBakeryOrdersTable.store_id, storeId),
                            eq(itemsTable.is_active, true),
                            eq(parsTable.store_id, storeId),
                            sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`,
                            isNull(storeBakeryOrdersTable.submitted_at)
                            // eq(orderStagesTable.stage_name, 'DUE')
                            // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                        )
                    )
                    .orderBy(asc(bakeryOrdersTable.item_id));
            });

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
        // (admin view)
        try {
            const result = await queryWithAuthRole(async (tx) => {
                return await tx
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
                        pars_value: sql`${
                            parsTable[day as keyof typeof parsTable]
                        }`,
                    })
                    .from(storeBakeryOrdersTable)
                    .innerJoin(
                        bakeryOrdersTable,
                        eq(
                            bakeryOrdersTable.id,
                            storeBakeryOrdersTable.order_id
                        )
                    )
                    .innerJoin(
                        itemsTable,
                        eq(itemsTable.id, bakeryOrdersTable.item_id)
                    )
                    .innerJoin(
                        storesTable,
                        eq(storesTable.id, storeBakeryOrdersTable.store_id)
                    )
                    .innerJoin(parsTable, eq(parsTable.item_id, itemsTable.id))
                    .where(
                        and(
                            eq(itemsTable.is_active, true),
                            eq(
                                parsTable.store_id,
                                storeBakeryOrdersTable.store_id
                            ),
                            sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`,
                            isNull(storeBakeryOrdersTable.submitted_at)
                            // eq(orderStagesTable.stage_name, 'DUE')
                            // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                        )
                    )
                    .orderBy(asc(storeBakeryOrdersTable.store_id));
            });
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

// Get external vendor orders for each store (store -> orders due page)
export async function getStoreOrders(
    store_location_id: string | null,
    dow: number
) {
    const day = getDaysName(dow);

    if (store_location_id) {
        try {
            const storeId = parseInt(store_location_id);
            const result = await queryWithAuthRole(async (tx) => {
                return await tx
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
                        pars_value: sql`${
                            parsTable[day as keyof typeof parsTable]
                        }`,
                    })
                    .from(storeOrdersTable)
                    .innerJoin(
                        ordersTable,
                        eq(storeOrdersTable.order_id, ordersTable.id)
                    )
                    .innerJoin(
                        itemsTable,
                        eq(ordersTable.item_id, itemsTable.id)
                    )
                    .innerJoin(
                        storesTable,
                        eq(storesTable.id, storeOrdersTable.store_id)
                    )
                    .innerJoin(parsTable, eq(parsTable.item_id, itemsTable.id))
                    .where(
                        and(
                            eq(storeOrdersTable.store_id, storeId),
                            sql`${storeOrdersTable.created_at}
                            >= now() - interval '72 hours'`,
                            eq(parsTable.store_id, storeId),
                            eq(itemsTable.is_active, true)
                            // eq(storeOrdersTable.created_at, sql`<WITHIN THE WEEK>`),
                            // eq(orderStagesTable.stage_name, 'DUE')
                        )
                    )
                    .orderBy(asc(ordersTable.item_id));
            });
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
            const result = await queryWithAuthRole(async (tx) => {
                return await tx
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
                        pars_value: sql`${
                            parsTable[day as keyof typeof parsTable]
                        }`,
                    })
                    .from(storeOrdersTable)
                    .innerJoin(
                        ordersTable,
                        eq(storeOrdersTable.order_id, ordersTable.id)
                    )
                    .innerJoin(
                        itemsTable,
                        eq(ordersTable.item_id, itemsTable.id)
                    )
                    .innerJoin(
                        storesTable,
                        eq(storesTable.id, storeOrdersTable.store_id)
                    )
                    .innerJoin(parsTable, eq(parsTable.item_id, itemsTable.id))
                    .where(
                        and(
                            eq(itemsTable.is_active, true),
                            sql`${storeOrdersTable.created_at}
                            >= now() - interval '72 hours'`,
                            eq(parsTable.store_id, storeOrdersTable.store_id)
                        )
                    )
                    .orderBy(asc(storeOrdersTable.store_id));
            });
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
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
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
        });
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
        return result;
    } else {
        // Return ALL stock items
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
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
        });
        // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))

        return result;
    }

    // return result;
}

// Output empty milk and bread items for store managers to fill in their stock counts
export async function getMilkBreadStock(store_location_id: string) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

    const storeId = parseInt(store_location_id);
    const result = await queryWithAuthRole(async (tx) => {
        return await tx
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
                    gt(stockTable.created_at, sql`now() - interval '2 day'`),
                    or(
                        eq(itemsTable.cron_categ, 'MILK'),
                        eq(itemsTable.cron_categ, 'BREAD')
                    )
                )
            );
    });
    // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    return result;
}

export async function getWasteStock(store_location_id: string) {
    // const dummyDate: string = '2025-06-15'; // dummy data for now

    const storeId = parseInt(store_location_id);
    const result = await queryWithAuthRole(async (tx) => {
        return await tx
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
    });
    // .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    return result;
}

// Get daily bakery orders, either across all stores or for a specific store (bakery -> daily orders page)
export async function getBakerysOrders(store_location_id?: number | undefined) {
    // TODO: inner join or left join for all store orders?

    let result;
    if (store_location_id) {
        // Get orders for a specific store (bakery's edit btn view)
        try {
            const storeId = store_location_id;
            result = await queryWithAuthRole(async (tx) => {
                return await tx
                    .select({
                        id: storeBakeryOrdersTable.id,
                        name: itemsTable.name,
                        units: bakeryOrdersTable.units,
                        completed_at:
                            storeBakeryOrdersTable.bakery_completed_at,
                        order_qty: storeBakeryOrdersTable.order_qty,
                        //         order_qty: sql<number>`COALESCE(SUM(${storeBakeryOrdersTable.order_qty}), 0)`,
                    })
                    .from(storeBakeryOrdersTable)
                    .innerJoin(
                        bakeryOrdersTable,
                        eq(
                            bakeryOrdersTable.id,
                            storeBakeryOrdersTable.order_id
                        )
                    )
                    .innerJoin(
                        itemsTable,
                        eq(itemsTable.id, bakeryOrdersTable.item_id)
                    )
                    .where(
                        and(
                            eq(itemsTable.is_active, true),
                            eq(storeBakeryOrdersTable.store_id, storeId),
                            sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`,

                            // Only works up to 4pm, after that it will return no results:
                            // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                            gt(
                                sql`${storeBakeryOrdersTable.order_qty}::decimal`,
                                0
                            )
                        )
                    );
            });
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
            result = await queryWithAuthRole(async (tx) => {
                return await tx
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
                        eq(
                            bakeryOrdersTable.id,
                            storeBakeryOrdersTable.order_id
                        )
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
                            sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`,
                            isNull(storeBakeryOrdersTable.bakery_completed_at)
                            // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`
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
            });
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

    const result = await queryWithAuthRole(async (tx) => {
        return await tx
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
    });

    return result;
}

export async function getVendorContacts() {
    try {
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
                .select({
                    id: vendorsTable.id,
                    name: vendorsTable.name,
                    email: vendorsTable.email,
                    logo: vendorsTable.logo,
                    website: vendorsTable.website,
                    phone: vendorsTable.phone,
                })
                .from(vendorsTable)
                .orderBy(asc(vendorsTable.name));
        });

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
}

export async function getBakeryDueTodayCount() {
    try {
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
                .select({
                    count: count(storeBakeryOrdersTable.id),
                })
                .from(storeBakeryOrdersTable)
                .where(
                    and(
                        sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`,
                        // CURRENT_DATE AT TIME ZONE 'PST' doesnt work after midnight for some odd reason, works in afternoon
                        // sql`(EXTRACT(DAY FROM DATE(created_at AT TIME ZONE 'PST')) = EXTRACT(DAY FROM CURRENT_DATE AT TIME ZONE 'PST'))`,
                        // sql`(EXTRACT(MONTH FROM DATE(created_at AT TIME ZONE 'PST')) = EXTRACT(MONTH FROM CURRENT_DATE AT TIME ZONE 'PST'))`,
                        // sql`(EXTRACT(YEAR FROM DATE(created_at AT TIME ZONE 'PST')) = EXTRACT(YEAR FROM CURRENT_DATE AT TIME ZONE 'PST'))`,
                        isNull(storeBakeryOrdersTable.submitted_at)
                        // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`,
                    )
                );
        });
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
            data: [],
        };
    }
}

export async function getItemCount() {
    try {
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
                .select({
                    count: count(itemsTable.id),
                })
                .from(itemsTable);
        });

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
            data: [],
        };
    }
}

// Returns all items (eg for manage -> inventory page)
export async function getAllItems() {
    try {
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
                .select({
                    id: itemsTable.id,
                    name: itemsTable.name,
                    vendor_name: vendorsTable.name,
                    is_active: itemsTable.is_active,
                    list_price: itemsTable.list_price,
                    units: itemsTable.units,
                    is_waste_tracked: itemsTable.is_waste_tracked,
                    invoice_categ: itemsTable.invoice_categ,
                    store_categ: itemsTable.store_categ,
                    picture: itemsTable.picture,
                })
                .from(itemsTable)
                .innerJoin(
                    vendorsTable,
                    eq(itemsTable.vendor_id, vendorsTable.id)
                )
                .orderBy(asc(itemsTable.name));
        });

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
            data: [],
        };
    }
}

export async function getStoreCount() {
    try {
        const result = await queryWithAuthRole(async (tx) => {
            return await tx
                .select({
                    count: count(storesTable.id),
                })
                .from(storesTable);
        });
        // const result = await db
        //     .select({
        //         count: count(storesTable.id),
        //     })
        //     .from(storesTable);

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
            data: [],
        };
    }
}

// Helper functions

// custom lower function
export function lower(name: PgColumn) {
    return sql`lower(${name})`;
}

function getDaysName(dow: number): string {
    // order of weekdays[] elements matters -- must match with JS's Date implementation
    const weekdays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    return weekdays[dow];
}

async function queryWithAuthRole<T>(queryFn: (tx: any) => Promise<T>) {
    return await db.transaction(async (tx) => {
        if (process.env.APP_ENV !== 'test') {
            await tx.execute(sql`SET LOCAL ROLE authenticated`);
        }
        return await queryFn(tx);
    });
}
