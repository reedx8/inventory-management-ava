import { getStoreOrders } from '@/db/queries/select';
import { putStoreOrders } from '@/db/queries/update';
// import { NextResponse } from 'next/server';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { OrderItem } from '@/app/(main)/store/types';

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
        const response = await getStoreOrders(storeId); //
        if (!response.success) {
            return NextResponse.json(response.error, { status: 400 });
        }
        return Response.json(response.data, { status: 200 });
    } catch (error) {
        // console.error('Error fetching store orders:', error);
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Send store orders (store page)
export async function PUT(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId');
    const data: OrderItem[] = await request.json();

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // return Response.redirect('/login');
    }

    if (!storeId) {
        return NextResponse.json(
            { error: 'You need to pass in a store id to this API route' },
            { status: 400 }
        );
    }

    try {
        const response = await putStoreOrders(storeId, data); //
        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        // console.error('Error fetching store orders:', error);
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
