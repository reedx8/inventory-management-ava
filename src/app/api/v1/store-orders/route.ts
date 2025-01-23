import { getStoreOrders } from '@/db/queries/select';
// import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
    // console.log('storeId: ', storeId);

    try {
        const orders = await getStoreOrders(storeId); //
        return Response.json(orders);
    } catch (error) {
        console.error('Error fetching store orders:', error);
        return Response.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
