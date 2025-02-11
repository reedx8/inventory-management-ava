import { getBakerysOrders } from '@/db/queries/select';
import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

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
