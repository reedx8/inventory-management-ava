import { getStoreOrders } from '@/db/queries/select';
// import { NextResponse } from 'next/server';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
    // console.log('storeId: ', storeId);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // return Response.redirect('/login');
    }

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
