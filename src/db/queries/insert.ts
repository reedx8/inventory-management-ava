import { db } from '../index';
import { and, eq, sql } from 'drizzle-orm';
import { ordersTable, stockTable, weekCloseTable } from '../schema';
import { config } from 'dotenv';
import { SheetDataType } from '@/components/types';
import { SundayCloseType } from '@/app/(main)/store/stock/components/sunday-close-data';
// import { MilkBreadOrder } from '@/app/(main)/orders/types';
config({ path: '.env' });

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
