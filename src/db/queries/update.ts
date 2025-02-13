import { eq, and, sql } from 'drizzle-orm';
import { db } from '../index';
import {
    // ordersTable,
    // itemsTable,
    // storesTable,
    stockTable,
    // vendorItemsTable,
    bakeryOrdersTable,
    // storeOrdersTable,
} from '../schema';
// import { parse } from 'path';

// Post milk break stock counts
export async function postMilkBreadStock(
    store_location_id: string,
    data: {
        storeId: number;
        items: Array<{ itemId: number; count: number }>;
    }
) {
    try {
        const storeId = parseInt(store_location_id);

        const updates = await db.transaction(async (trx) => {
            const results = await Promise.all(
                data.items.map(async (item) => {
                    try {
                        const updated = await trx
                            .update(stockTable)
                            .set({
                                qty_on_hand: sql`${item.count}::decimal`,
                                submitted_at: sql`now()`,
                            })
                            .where(
                                and(
                                    eq(stockTable.id, item.itemId),
                                    eq(stockTable.store_id, storeId)
                                )
                            )
                            .returning();

                        return {
                            itemId: item.itemId,
                            updated: updated.length > 0 ? true : false,
                        };
                    } catch (error) {
                        const err = error as Error;
                        return {
                            success: false,
                            itemId: item.itemId,
                            error: err.message,
                        };
                    }
                })
            );
            return results;
        });

        // Check if any updates failed
        const failures = updates.filter((update) => update.updated === false);
        if (failures.length > 0) {
            return {
                status: false,
                message: 'Some or all updates failed',
                updates,
            };
        }
        return {
            status: true,
            message: 'All updates successful',
            updates,
        };

        //   return {
        //       updates
        //   };
    } catch (error) {
        // Handle any overall transaction failures
        const err = error as Error;
        return {
            status: false,
            message: 'Transaction failed',
            error: err.message,
        };
    }
}

// Send bakery's batch complete orders
export async function putBakeryBatchCompleteOrders(
    data: Array<{ id: number; order_qty: number }>
) {
    // TODO: update store_bakery_orders.made_qty as well
    try {
        const updates = await db.transaction(async (trx) => {
            const results = await Promise.all(
                data.map(async (order) => {
                    try {
                        const updated = await trx
                            .update(bakeryOrdersTable)
                            .set({
                                temp_tot_made: sql`${order.order_qty}::decimal`,
                                completed_at: sql`now()`,
                            })
                            .where(and(eq(bakeryOrdersTable.id, order.id)))
                            .returning();

                        return {
                            id: order.id,
                            updated: updated.length > 0 ? true : false,
                        };
                    } catch (error) {
                        const err = error as Error;
                        return {
                            success: false,
                            id: order.id,
                            error: err.message,
                        };
                    }
                })
            );
            return results;
        });

        const failures = updates.filter((update) => update.updated === false);
        if (failures.length > 0) {
            return {
                status: false,
                message: 'Some or all updates failed',
                updates,
            };
        }
        return {
            status: true,
            message: 'All updates successful',
            updates,
        };
    } catch (error) {
        const err = error as Error;
        return {
            status: false,
            message: 'Transaction failed',
            error: err.message,
        };
    }
}
