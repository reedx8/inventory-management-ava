// import { getCakeOrders } from '@/db/queries/select';
// import { NextResponse } from 'next/server';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
    // const searchParams: URLSearchParams = request.nextUrl.searchParams;
    // const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
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
        // Get ALL orders made on squarespace site
        const response = await fetch(
            'https://api.squarespace.com/1.0/commerce/orders',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + process.env.SQUARESPACE_API_KEY,
                    'User-Agent': 'IMS',
                },
            }
        );
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(response, { status: 400 });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // console.error('Error fetching store orders:', error);
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
