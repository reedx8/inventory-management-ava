import { eq, and, sql, isNull } from 'drizzle-orm';
import { db } from '../index';
import {
    // ordersTable,
    // itemsTable,
    // storesTable,
    stockTable,
    // vendorItemsTable,
    storeBakeryOrdersTable,
    storeOrdersTable,
    parsTable,
} from '../schema';
import { OrderItem } from '@/app/(main)/store/types';
import { SheetDataType } from '@/components/types';
// import { parse } from 'path';
import { config } from 'dotenv';
config({ path: '.env' });

// Send store's orders for external vendors only (store page)
export async function putStoreOrders(
    storeIdNum: string,
    data: OrderItem[]
    // data: Array<{ id: number; order: number }>
) {
    const storeId = parseInt(storeIdNum);

    // TODO: where should include a date check as well, + will cause 'some updates failed' when store ids dont match, ie admin view submitting orders)
    try {
        const updates = await executeWithAuthRole(async (trx) => {
            const results = await Promise.all(
                data.map(async (order) => {
                    try {
                        const updated = await trx
                            .update(storeOrdersTable)
                            .set({
                                qty: sql`${order.order}::decimal`,
                                submitted_at: sql`now()`,
                            })
                            .where(
                                and(
                                    eq(storeOrdersTable.store_id, storeId),
                                    eq(storeOrdersTable.id, order.id)
                                )
                            )
                            .returning({
                                id: storeOrdersTable.id,
                                store_id: storeOrdersTable.store_id,
                            });

                        return {
                            id: order.id,
                            updated: updated.length > 0,
                            updatedRow: updated,
                            error: null,
                        };
                    } catch (error) {
                        const err = error as Error;
                        return {
                            id: order.id,
                            updated: false,
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
                success: false,
                message: 'Some or all updates failed',
                updates,
            };
        }

        return {
            success: true,
            message: 'All updates successful',
            updates,
        };
    } catch (error) {
        // transaction failed
        const err = error as Error;
        return {
            success: false,
            message: 'Transaction failed',
            error: err.message,
        };
    }
}
export async function putStoreBakeryOrders(
    storeIdNum: string,
    data: OrderItem[]
) {
    const storeId = parseInt(storeIdNum);
    console.log('putStoreBakeryOrders');
    const updates = await executeWithAuthRole(async (trx) => {
        const results = [];

        for (const order of data) {
            try {
                const updated = await trx.execute(
                    sql`UPDATE store_bakery_orders 
                        SET order_qty = ${order.order}, submitted_at = now() 
                        WHERE store_id = ${storeId} AND id = ${order.id}
                        RETURNING id, store_id, order_qty`
                );
                // console.log(
                //     `Updating order ID: ${order.id} with qty: ${order.order}`
                // );

                // // Check if record exists first
                // const exists = await trx
                //     .select({ id: storeBakeryOrdersTable.id })
                //     .from(storeBakeryOrdersTable)
                //     .where(
                //         and(
                //             eq(storeBakeryOrdersTable.store_id, storeId),
                //             eq(storeBakeryOrdersTable.id, order.id)
                //         )
                //     )
                //     .limit(1);

                // if (exists.length === 0) {
                //     console.log(
                //         `Order ${order.id} not found for store ${storeId}`
                //     );
                //     results.push({
                //         id: order.id,
                //         updated: false,
                //         error: 'Record not found',
                //     });
                //     continue;
                // }

                // // Perform the update
                // const updated = await trx
                //     .update(storeBakeryOrdersTable)
                //     .set({
                //         order_qty: order.order,
                //         submitted_at: sql`now()`,
                //     })
                //     .where(
                //         and(
                //             eq(storeBakeryOrdersTable.store_id, storeId),
                //             eq(storeBakeryOrdersTable.id, order.id)
                //         )
                //     )
                //     .returning({
                //         id: storeBakeryOrdersTable.id,
                //         store_id: storeBakeryOrdersTable.store_id,
                //         order_qty: storeBakeryOrdersTable.order_qty,
                //     });

                // console.log('Updated:', updated);
                results.push({
                    id: order.id,
                    updated: updated.length > 0,
                    updatedRow: updated,
                    error: null,
                });
            } catch (error) {
                const err = error as Error;
                console.error(`Error updating order ${order.id}:`, err);
                results.push({
                    id: order.id,
                    updated: false,
                    error: err.message,
                });
            }
        }

        return results;
    });
    const failures = updates.filter((update) => update.updated === false);
    if (failures.length > 0) {
        return {
            success: false,
            message: 'Some or all updates failed',
            updates,
        };
    }

    return {
        success: true,
        message: 'All updates successful',
        updates,
    };
}

// Send store's orders for bakery items only (store -> orders due page's submit btn)
// export async function putStoreBakeryOrders(
//     storeIdNum: string,
//     data: OrderItem[]
//     // data: Array<{ id: number; order: number }>
// ) {
//     const storeId = parseInt(storeIdNum);
//     console.log('putStoreBakeryOrders');
//     // console.log('storeId: ', storeId);
//     // console.log('data: ', data);

//     // TODO: where should include a date check as well, + will cause 'some updates failed' when store ids dont match, ie admin view submitting orders)
//     try {
//         const updates = await executeWithAuthRole(async (trx) => {
//             const results = await Promise.all(
//                 data.map(async (order) => {
//                     try {
//                         const before = await trx
//                             .select()
//                             .from(storeBakeryOrdersTable)
//                             .where(
//                                 and(
//                                     eq(
//                                         storeBakeryOrdersTable.store_id,
//                                         storeId
//                                     ),
//                                     eq(storeBakeryOrdersTable.id, order.id)
//                                 )
//                             );
//                         console.log('Before: ', before);

//                         const updated = await trx
//                             .update(storeBakeryOrdersTable)
//                             .set({
//                                 order_qty: order.order,
//                                 // order_qty: sql`${order.order}::decimal`,
//                                 submitted_at: sql`now()`,
//                             })
//                             .where(
//                                 and(
//                                     eq(
//                                         storeBakeryOrdersTable.store_id,
//                                         storeId
//                                     ),
//                                     eq(storeBakeryOrdersTable.id, order.id)
//                                 )
//                             )
//                             .returning({
//                                 id: storeBakeryOrdersTable.id,
//                                 store_id: storeBakeryOrdersTable.store_id,
//                                 order_qty: storeBakeryOrdersTable.order_qty,
//                                 affected_rows: sql`xmax <> 0`, // This will tell you if rows were actually modified
//                             });

//                         console.log('After: ', updated);

//                         return {
//                             id: order.id,
//                             updated: updated.length > 0,
//                             updatedRow: updated,
//                             error: null,
//                         };
//                     } catch (error) {
//                         const err = error as Error;
//                         return {
//                             id: order.id,
//                             updated: false,
//                             error: err.message,
//                         };
//                     }
//                 })
//             );
//             return results;
//         });

//         const failures = updates.filter((update) => update.updated === false);
//         if (failures.length > 0) {
//             return {
//                 success: false,
//                 message: 'Some or all updates failed',
//                 updates,
//             };
//         }

//         return {
//             success: true,
//             message: 'All updates successful',
//             updates,
//         };
//     } catch (error) {
//         // transaction failed
//         const err = error as Error;
//         return {
//             success: false,
//             message: 'Transaction failed',
//             error: err.message,
//         };
//     }
// }

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

        const updates = await executeWithAuthRole(async (trx) => {
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

// Send bakery's completed orders from today per store, from bakery's edit btn
export async function putBakeryEditOrders(
    data: Array<{ id: number; order_qty: number }>
) {
    try {
        const updates = await executeWithAuthRole(async (trx) => {
            const results = await Promise.all(
                data.map(async (order) => {
                    try {
                        // throw new Error('Testing error handling');
                        const updated = await trx
                            .update(storeBakeryOrdersTable)
                            .set({
                                made_qty: sql`${order.order_qty}::decimal`,
                                bakery_completed_at: sql`now()`,
                            })
                            .where(
                                and(
                                    eq(storeBakeryOrdersTable.id, order.id),
                                    sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`
                                    // sql`DATE(${storeBakeryOrdersTable.created_at}) = CURRENT_DATE`
                                )
                            )
                            .returning();

                        return {
                            id: order.id,
                            updated: updated.length > 0,
                        };
                    } catch (error) {
                        const err = error as Error;
                        return {
                            id: order.id,
                            updated: false,
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
                success: false,
                message: 'Some or all updates failed',
                updates,
            };
        }
        return {
            success: true,
            message: 'All updates successful',
            updates,
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            message: 'Transaction failed',
            error: err.message,
        };
    }
}

// Batch Complete Btn Pressed: batch complete today's orders not already made
// TODO: should send in exact orders to batck complete instead
export async function putBakeryBatchCompleteOrders() {
    try {
        const updates = await executeWithAuthRole(async (trx) => {
            try {
                const updated = await trx
                    .update(storeBakeryOrdersTable)
                    .set({
                        made_qty: sql`${storeBakeryOrdersTable.order_qty}`,
                        bakery_completed_at: sql`now()`,
                    })
                    .where(
                        and(
                            isNull(storeBakeryOrdersTable.made_qty),
                            sql`${storeBakeryOrdersTable.created_at} >= NOW() - INTERVAL '20 hours'`
                            // sql`DATE(created_at) = CURRENT_DATE`
                        )
                    )
                    .returning();

                return updated.map((row: { id: any }) => ({
                    id: row.id,
                    updated: true,
                }));
            } catch (error) {
                const err = error as Error;
                return [
                    {
                        id: 0,
                        updated: false,
                        error: err.message,
                    },
                ];
            }
        });

        const failures = updates.filter(
            (update: { updated: boolean }) => update.updated === false
        );
        if (failures.length > 0) {
            return {
                success: false,
                message: 'Some or all updates failed',
                updates,
            };
        }

        return {
            success: true,
            message: 'All updates successful',
            updates,
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            message: 'Transaction failed',
            error: err.message,
        };
    }
}
// Updates daily PAR levels for a store (eg pastry par levels only)
export async function updateDailyParLevels({
    data,
    dow,
}: {
    data: SheetDataType[];
    dow: string;
}) {
    try {
        const updates = await executeWithAuthRole(async (trx) => {
            const results = await Promise.all(
                data.map(async (item) => {
                    // First check if the record exists
                    const existingRecord = await trx
                        .select()
                        .from(parsTable)
                        .where(
                            and(
                                eq(parsTable.item_id, item.id),
                                eq(parsTable.store_id, item.store_id)
                            )
                        )
                        .limit(1);

                    let updated;

                    if (existingRecord.length === 0) {
                        // Record doesn't exist, need to INSERT
                        updated = await trx
                            .insert(parsTable)
                            .values({
                                item_id: item.id,
                                store_id: item.store_id,
                                [dow as keyof typeof parsTable]: item.qty,
                            })
                            .returning();
                    } else {
                        // Record exists, perform UPDATE
                        updated = await trx
                            .update(parsTable)
                            .set({ [dow as keyof typeof parsTable]: item.qty })
                            .where(
                                and(
                                    eq(parsTable.item_id, item.id),
                                    eq(parsTable.store_id, item.store_id)
                                )
                            )
                            .returning();
                    }

                    return {
                        id: item.id,
                        updated: updated.length > 0,
                    };
                })
            );
            return results;
        });

        const failures = updates.filter((update) => update.updated === false);
        if (failures.length > 0) {
            return {
                success: false,
                message: 'Some or all updates failed',
                updates,
            };
        }

        return {
            success: true,
            message: 'All updates successful',
            updates,
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            message: 'Transaction failed',
            error: err.message,
        };
    }
}

// Updates daily PAR levels for a store (eg pastry par levels only)
// export async function updateDailyParLevels({
//     data,
//     dow,
// }: {
//     data: SheetDataType[];
//     dow: string;
// }) {
//     try {
//         const updates = await executeWithAuthRole(async (trx) => {
//             const results = await Promise.all(
//                 data.map(async (item) => {
//                     const updated = await trx
//                         .update(parsTable)
//                         .set({ [dow as keyof typeof parsTable]: item.qty })
//                         .where(
//                             and(
//                                 eq(parsTable.item_id, item.id),
//                                 eq(parsTable.store_id, item.store_id)
//                             )
//                         )
//                         .returning();
//                     // Format: UPDATE "pars" SET "column_name" = value WHERE ...
//                     // const query = sql`
//                     //     UPDATE ${parsTable}
//                     //     SET ${sql.identifier(dow)} = ${item.qty}
//                     //     WHERE "item_id" = ${item.id}
//                     //     AND "store_id" = ${item.store_id}
//                     //     RETURNING *
//                     // `;

//                     // const updated = await trx.execute(query);

//                     return {
//                         id: item.id,
//                         updated: updated.length > 0,
//                     };
//                 })
//             );
//             return results;
//         });

//         const failures = updates.filter((update) => update.updated === false);
//         if (failures.length > 0) {
//             return {
//                 success: false,
//                 message: 'Some or all updates failed',
//                 updates,
//             };
//         }

//         return {
//             success: true,
//             message: 'All updates successful',
//             updates,
//         };

//         // const results = await executeWithAuthRole(async (trx) => {
//         //     // Create an array of promises for each update operation
//         //     const updatePromises = data.map(async (item) => {
//         //         return await trx
//         //             .update(parsTable)
//         //             .set({ [dow as keyof typeof parsTable]: item.qty })
//         //             .where(
//         //                 and(
//         //                     eq(parsTable.item_id, item.id),
//         //                     eq(parsTable.store_id, item.store_id)
//         //                 )
//         //             );
//         //     });

//         //     // Wait for all update operations to complete
//         //     return await Promise.all(updatePromises);
//         // });

//         // const results = await executeWithAuthRole(async (trx) => {
//         //     data.map(async (item) => {
//         //         const updated = await trx
//         //             .update(parsTable)
//         //             .set({ [dow as keyof typeof parsTable]: item.qty })
//         //             .where(
//         //                 and(
//         //                     eq(parsTable.item_id, item.id),
//         //                     eq(parsTable.store_id, item.store_id)
//         //                 )
//         //             );
//         //     });
//         // });
//         // return {
//         //     success: true,
//         //     message: 'All updates successful',
//         // };
//     } catch (error) {
//         const err = error as Error;
//         return {
//             success: false,
//             message: 'Transaction failed',
//             error: err.message,
//         };
//     }
// }

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

// Send bakery's batch complete orders (from batch complete btn) (used for testing stages and when i used temp_* fields)
// export async function putBakeryBatchCompleteOrders(
//     data: Array<{ id: number; order_qty: number }>
// ) {
//     // TODO: update store_bakery_orders.made_qty as well
//     try {
//         const updates = await db.transaction(async (trx) => {
//             const results = await Promise.all(
//                 data.map(async (order) => {
//                     try {
//                         const updated = await trx
//                             .update(bakeryOrdersTable)
//                             .set({
//                                 temp_tot_made: sql`${order.order_qty}::decimal`,
//                                 completed_at: sql`now()`,
//                             })
//                             .where(and(eq(bakeryOrdersTable.id, order.id)))
//                             .returning();

//                         return {
//                             id: order.id,
//                             updated: updated.length > 0,
//                         };
//                     } catch (error) {
//                         const err = error as Error;
//                         return {
//                             id: order.id,
//                             updated: false,
//                             error: err.message,
//                         };
//                     }
//                 })
//             );
//             return results;
//         });

//         const failures = updates.filter((update) => update.updated === false);
//         if (failures.length > 0) {
//             return {
//                 success: false,
//                 message: 'Some or all updates failed',
//                 updates,
//             };
//         }
//         return {
//             success: true,
//             message: 'All updates successful',
//             updates,
//         };
//     } catch (error) {
//         const err = error as Error;
//         return {
//             success: false,
//             message: 'Transaction failed',
//             error: err.message,
//         };
//     }
// }
