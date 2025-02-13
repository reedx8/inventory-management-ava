import { getBakerysOrders } from '@/db/queries/select';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { putBakeryBatchCompleteOrders } from '@/db/queries/update';

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // return Response.redirect('/login');
    }

    try {
        const orders = await getBakerysOrders(); //
        return Response.json(orders);
    } catch (error) {
        console.error('Error fetching bakerys orders: ', error);
        return Response.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    // const searchParams: URLSearchParams = request.nextUrl.searchParams;
    // const submitType: string | null = searchParams.get('submitType');
    const completedOrders = await request.json();

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
        const response = await putBakeryBatchCompleteOrders(completedOrders);
        return Response.json(response);
    } catch (error) {
        const errMsg = "Error posting bakery's completed orders";
        console.error(errMsg, error);
        return Response.json({ error: errMsg }, { status: 500 });
    }
}
