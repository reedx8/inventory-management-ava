import { getStoresBakeryOrders } from '@/db/queries/select';
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
        const response = await getStoresBakeryOrders(storeId); //
        if (!response.success) {
            return NextResponse.json(response.error, { status: 400 });
        }
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        // console.error('Error fetching store orders:', error);
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
