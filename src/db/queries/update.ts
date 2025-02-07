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
// import { parse } from 'path';

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
                            .set({ count: sql`${item.count}::decimal` })
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
                    } catch (err) {
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
        return {
            status: false,
            message: 'Transaction failed',
            error: error.message,
        };
    }
}
