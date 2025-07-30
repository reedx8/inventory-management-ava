import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import {
    getMilkBreadStock,
    // getWasteStock,
    getWeeklyStock,
} from '@/db/queries/select';
// import { postMilkBreadStock } from '@/db/queries/update';
import { insertMilkBreadStock, postWeeklyStock } from '@/db/queries/insert';

// get stock for store managers (milk/bread, etc)
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
    const stockType: string | null = searchParams.get('stockType');
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
        switch (stockType) {
            case 'WEEKLY':
                const weeklyStock = await getWeeklyStock(storeId);
                return NextResponse.json(weeklyStock.data, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, no-cache, must-revalidate',
                        Pragma: 'no-cache',
                        Expires: '0',
                    },
                });
            case 'BREAD':
            case 'MILK':
                if (storeId) {
                    const milkBreadStock = await getMilkBreadStock(
                        Number(storeId),
                        stockType.toUpperCase()
                    );

                    if (!milkBreadStock.success) {
                        return NextResponse.json(
                            { error: milkBreadStock.error },
                            { status: 400 }
                        );
                    }

                    // dont cache since items/vendor_items may change in a day (eg items.is_active, etc)
                    return NextResponse.json(milkBreadStock.data, {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control':
                                'no-store, no-cache, must-revalidate',
                            Pragma: 'no-cache',
                            Expires: '0',
                        },
                    });
                }
                return NextResponse.json(
                    { error: 'GET api/v1/store-stock: No storeId provided' },
                    { status: 400 }
                );
            default:
                return NextResponse.json(
                    {
                        error: 'GET api/v1/store-stock: Provide a valid stockType (WEEKLY, BREAD, MILK)',
                    },
                    { status: 400 }
                );
        }
        // const stock = await getWeeklyStock(storeId); //
        // return Response.json(stock);
    } catch (error) {
        // console.error('Error fetching store stock:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
    const stockType: string | null = searchParams.get('stockType');
    const data = await request.json();

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
        switch (stockType) {
            case 'weekly':
                // insert stock counts for CTC/CCP&Sysco items
                if (storeId) {
                    const weeklyStock = await postWeeklyStock(data, storeId);
                    if (!weeklyStock.success) {
                        return NextResponse.json(
                            { error: weeklyStock },
                            { status: 400 }
                        );
                    }
                    return NextResponse.json(weeklyStock.data, { status: 200 });
                }
                return NextResponse.json(
                    { error: 'POST api/v1/store-stock: No storeId provided' },
                    { status: 400 }
                );
            case 'milkBread':
                if (storeId) {
                    const milkBreadStock = await insertMilkBreadStock(
                        data,
                        Number(storeId)
                    );
                    if (!milkBreadStock.success) {
                        return NextResponse.json(
                            { error: milkBreadStock.error },
                            { status: 400 }
                        );
                    }

                    return NextResponse.json(milkBreadStock, { status: 200 });
                }
                return NextResponse.json(
                    { error: 'POST api/v1/store-stock: No storeId provided' },
                    { status: 400 }
                );
            default:
                return NextResponse.json(
                    {
                        error: 'POST api/v1/store-stock: valid stockType not provided (milkBread, or weekly)',
                    },
                    { status: 400 }
                );
        }
    } catch (error) {
        // console.error('Error posting store stock:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
