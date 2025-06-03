import { db } from '../index';
import { and, eq, sql } from 'drizzle-orm';
import { ordersTable, stockTable, weekCloseTable } from '../schema';
import { config } from 'dotenv';
import { SheetDataType } from '@/components/types';
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

export async function insertUpdateWeekClose(data: any[], subCateg: string) {
    try {
        let desired_col;
        subCateg = subCateg.toLowerCase();
        if (subCateg === 'closed') {
            desired_col = 'closed_count';
            // desired_col = weekCloseTable.closed_count;
        } else if (subCateg === 'sealed') {
            desired_col = 'sealed_count';
        } else if (subCateg === 'weight') {
            desired_col = 'open_items_weight';
        } else if (subCateg === 'count') {
            // retail beans count and pastry count
            desired_col = 'count';
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
            const ifAlreadySubmitted = data.some(
                (item: any) => item.submitted_at !== null
            );

            if (ifAlreadySubmitted) {
                const updates = await Promise.all(
                    data.map(async (item: any) => {
                        await trx
                            .update(weekCloseTable)
                            .set({
                                [desired_col as keyof typeof weekCloseTable]:
                                    item.qty,
                                updated_at: sql`now()`,
                            })
                            .where(
                                and(
                                    eq(weekCloseTable.id, item.id),
                                    eq(weekCloseTable.store_id, item.store_id)
                                )
                            );
                    })
                );
                return updates;
            } else {
                // not already submitted:
                const inserts = await Promise.all(
                    data.map(async (item: any) => {
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
                // return await trx.insert(weekCloseTable).values(data);
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
