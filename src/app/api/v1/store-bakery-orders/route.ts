import { getStoresBakeryOrders } from '@/db/queries/select';
// import { NextResponse } from 'next/server';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
export const dynamic = 'force-dynamic'; // no caching

// store -> orders due page
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
    const dow_num: number | null = parseInt(searchParams.get('dow')!);
    // console.log('storeId: ', storeId);

    const valid_days = [0, 1, 2, 3, 4, 5, 6];
    if (dow_num === null || !valid_days.includes(dow_num)) {
        return NextResponse.json(
            {
                error: `You need to pass tomorrow's day of week number to api/v1/store-bakery-orders (e.g. 0-6)`,
            },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // return Response.redirect('/login');
    }

    try {
        const response = await getStoresBakeryOrders(storeId, dow_num); //
        if (!response.success) {
            return NextResponse.json(response.error, { status: 400 });
        }
        // should prevent netlify from caching this response
        return new NextResponse(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });

        // return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        // console.error('Error fetching store orders:', error);
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
