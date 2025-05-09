import { db } from '../index';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { stockTable } from '../schema';
import { config } from 'dotenv';
config({ path: '.env' });

export async function inserMilkBreadStock() {}

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
