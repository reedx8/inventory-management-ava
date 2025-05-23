import { getMilkBreadStockOrders } from '@/db/queries/select';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { updateMilkBreadStockOrders } from '@/db/queries/update';
// import { insertMilkBreadStockOrders } from '@/db/queries/insert';

// get milk bread stock orders for order managers
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const dataRequested: string | null = searchParams.get('fetch');

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let response;

        if (dataRequested === 'stock') {
            // console.log('Fetching stock data');
            response = await getMilkBreadStockOrders();
        } else {
            return NextResponse.json(
                {
                    error: "GET api/v1/milk-bread needs 'fetch' in API url along with valid data requested (stock)",
                },
                { status: 400 }
            );
        }

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

// insert milk bread orders from order managers, will be called per store
export async function PUT(request: NextRequest) {
    const data = await request.json();
    // const data = body.data;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await updateMilkBreadStockOrders(data);

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
