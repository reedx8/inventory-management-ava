import { db } from '../index';
import { and, eq, sql } from 'drizzle-orm';
import { ordersTable, stockTable, weekCloseTable } from '../schema';
import { config } from 'dotenv';
import { SheetDataType } from '@/components/types';
import { SundayCloseType } from '@/app/(main)/store/stock/components/sunday-close-data';
import { OrderItem, StockItem } from '@/app/(main)/store/types';
// import { MilkBreadOrder } from '@/app/(main)/orders/types';
config({ path: '.env' });

// Send store's orders for external vendors only, ie CTC/CCP & Sysco (store page -> submit btn)
export async function postStoreOrders(storeIdNum: string, data: OrderItem[]) {
    const storeId = parseInt(storeIdNum);

    try {
        const result = await executeWithAuthRole(async (trx) => {
            return await Promise.all(
                // data is an *array* of order items of type OrderItem
                data.map(async (item) => {
                    const existingStock = await trx
                        .select({ id: stockTable.id })
                        .from(stockTable)
                        .where(
                            and(
                                eq(stockTable.item_id, item.id),
                                eq(stockTable.store_id, storeId),
                                sql`${stockTable.submitted_at} >= NOW() - INTERVAL '24 hours'`
                            )
                        )
                        .limit(1);

                    if (existingStock.length > 0) {
                        // connect the existing stock record to new order record
                        return await trx.insert(ordersTable).values({
                            store_id: storeId,
                            stock_id: existingStock[0].id,
                            item_id: item.id,
                            qty: item.order,
                            par: item.pars_value,
                            units: item.qty_per_order,
                            list_price: item.list_price,
                            vendor_id: item.vendor_id, // not needed but may be helpful
                            store_submit_at: sql`now()`,
                        });
                    } else {
                        // else just insert the new order without connecting to stock table
                        return await trx.insert(ordersTable).values({
                            store_id: storeId,
                            item_id: item.id,
                            qty: item.order,
                            par: item.pars_value,
                            units: item.qty_per_order,
                            list_price: item.list_price,
                            vendor_id: item.vendor_id, // not needed but may be helpful
                            store_submit_at: sql`now()`,
                        });
                    }
                })
            );
        });

        return {
            success: true,
            data: result,
            error: null,
        };
    } catch (error) {
        // transaction failed
        const err = error as Error;
        return {
            success: false,
            data: null,
            error: err.message,
        };
    }
}

// Insert stock counts for CTC/CCP&Sysco items
export async function postWeeklyStock(data: StockItem[], storeId: string) {
    const storeIdNum = parseInt(storeId);

    try {
        const results = await executeWithAuthRole(async (trx) => {
            return await Promise.all(
                data.map(async (item) => {
                    const existingOrder = await trx
                        .select({ id: ordersTable.id })
                        .from(ordersTable)
                        .where(
                            and(
                                eq(ordersTable.item_id, item.id),
                                eq(ordersTable.store_id, storeIdNum),
                                sql`${ordersTable.store_submit_at} >= NOW() - INTERVAL '24 hours'`
                            )
                        )
                        .limit(1);

                    if (existingOrder.length > 0) {
                        // insert into stock table then connect stock record with existing orders record
                        const stockRecord = await trx
                            .insert(stockTable)
                            .values({
                                store_id: storeIdNum,
                                item_id: item.id,
                                count: item.count,
                                units: item.units,
                                submitted_at: sql`now()`,
                            })
                            .returning({ id: stockTable.id });

                        return await trx
                            .update(ordersTable)
                            .set({
                                stock_id: stockRecord[0].id,
                            })
                            .where(eq(existingOrder[0].id, ordersTable.id));
                    } else {
                        // else just insert the stock count
                        return await trx.insert(stockTable).values({
                            store_id: storeIdNum,
                            item_id: item.id,
                            count: item.count,
                            units: item.units,
                            submitted_at: sql`now()`,
                        });
                    }
                })
            );
        });
        return {
            success: true,
            data: results,
            error: null,
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

// Inserts milk bread stock from store managers
export async function insertMilkBreadStock(
    data: SheetDataType[],
    storeId: number
) {
    try {
        const results = await executeWithAuthRole(async (trx) => {
            const updates = await Promise.all(
                data.map(async (item: SheetDataType) => {
                    const stockTableInsert = await trx
                        .insert(stockTable)
                        .values({
                            item_id: item.id,
                            store_id: item.store_id,
                            count: item.qty,
                            units: item.units,
                            submitted_at: sql`now()`,
                        })
                        .returning({ id: stockTable.id });

                    const ordersTableInsert = await trx
                        .insert(ordersTable)
                        .values({
                            item_id: item.id,
                            store_id: item.store_id,
                            stock_id: stockTableInsert[0].id,
                            units: item.units,
                            store_submit_at: sql`now()`,
                        })
                        .returning({ id: ordersTable.id });

                    return {
                        stockId: stockTableInsert[0].id,
                        orderId: ordersTableInsert[0].id,
                        updatedStock: stockTableInsert.length > 0,
                        updatedOrder: ordersTableInsert.length > 0,
                    };
                })
            );
            return updates;
        });

        const stockFailures = results.filter(
            (result) => result.updatedStock === false
        );
        const orderFailures = results.filter(
            (result) => result.updatedOrder === false
        );

        if (stockFailures.length > 0 || orderFailures.length > 0) {
            return {
                success: false,
                error: 'Some or all updates failed',
                stockFailures,
                orderFailures,
            };
        }

        return {
            success: true,
            data: results,
            error: null,
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

export async function insertUpdateWeekClose(
    data: SundayCloseType[],
    subCateg: string
) {
    try {
        let desired_col;
        subCateg = subCateg.toLowerCase();
        if (subCateg === 'closed') {
            // for meat items:
            desired_col = 'closed_count';
        } else if (subCateg === 'sealed') {
            desired_col = 'sealed_count';
        } else if (subCateg === 'weight') {
            desired_col = 'open_items_weight';
        } else if (subCateg === 'count') {
            // for pastry items:
            desired_col = 'count';
        } else if (subCateg === 'unexpired') {
            // for retail bean items:
            desired_col = 'unexpired_count';
        } else if (subCateg === 'expired') {
            desired_col = 'expired_count';
        } else if (subCateg === 'reused') {
            desired_col = 'reused_count';
        } else {
            return {
                success: false,
                error: 'Invalid sub-category',
                data: null,
            };
        }

        const results = await executeWithAuthRole(async (trx) => {
            // submitted_at === null if weekCloseTable.submitted_at record isnt within past 24 hours for that store
            const ifAlreadySubmitted = data.some(
                (item: SundayCloseType) => item.submitted_at !== null
            );

            if (ifAlreadySubmitted) {
                // found record(s) for that store within past 24 hours
                const updates = await Promise.all(
                    data.map(async (item: SundayCloseType) => {
                        await trx
                            .update(weekCloseTable)
                            .set({
                                [desired_col as keyof typeof weekCloseTable]:
                                    item.qty,
                                updated_at: sql`now()`,
                            })
                            .where(
                                and(
                                    eq(weekCloseTable.id, item.id), // item.id will be weekCloseTable.id if select.ts query found records for that store within past 24 hours. Otherwise item.id is itemsTable.id
                                    eq(weekCloseTable.store_id, item.store_id)
                                )
                            );
                    })
                );
                return updates;
            } else {
                // no record(s) found for that store within past 24 hours, ie not already submitted
                const inserts = await Promise.all(
                    data.map(async (item: SundayCloseType) => {
                        return await trx.insert(weekCloseTable).values({
                            item_id: item.id,
                            store_id: item.store_id,
                            [desired_col as keyof typeof weekCloseTable]:
                                item.qty,
                            submitted_at: sql`now()`,
                        });
                    })
                );
                return inserts;
            }
        });
        return {
            success: true,
            data: results,
            error: null,
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

// Helper function for authenticated transactions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeWithAuthRole<T>(queryFn: (tx: any) => Promise<T>) {
    return await db.transaction(async (tx) => {
        if (process.env.APP_ENV !== 'test') {
            await tx.execute(sql`SET LOCAL ROLE authenticated`);
            // console.log('Auth role set');
        }
        // await tx.execute(sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED`);
        return await queryFn(tx);
    });
}
