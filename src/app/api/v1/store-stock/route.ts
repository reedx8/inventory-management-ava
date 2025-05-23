import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import {
    getMilkBreadStock,
    getWasteStock,
    getWeeklyStock,
} from '@/db/queries/select';
// import { postMilkBreadStock } from '@/db/queries/update';
import { insertMilkBreadStock } from '@/db/queries/insert';

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
            case 'weekly':
                const weeklyStock = await getWeeklyStock(storeId);
                return NextResponse.json(weeklyStock, {
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
                    { error: 'GET api/v1/store-stock no storeId provided' },
                    { status: 400 }
                );
            case 'waste':
                if (storeId) {
                    const weeklyStock = await getWasteStock(storeId);
                    return NextResponse.json(weeklyStock, {
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
                    { error: 'GET api/v1/store-stock no storeId provided' },
                    { status: 400 }
                );
            default:
                return NextResponse.json(
                    {
                        error: 'GET api/v1/store-stock invalid stockType: Provide a valid stockType through your api url',
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
            // case 'weekly':
            //     const weeklyStock = await postWeeklyStock(storeId);
            //     return Response.json(weeklyStock);
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

                    return NextResponse.json(milkBreadStock);
                }
                return NextResponse.json(
                    { error: 'POST api/v1/store-stock no storeId provided' },
                    { status: 400 }
                );
            // case 'waste':
            //     if (storeId) {
            //         const wasteStock = await postWasteStock(storeId);
            //         return Response.json(weeklyStock);
            //     }
            //     return Response.json({ error: 'No storeId provided' }, { status: 400 });
            default:
                return NextResponse.json(
                    {
                        error: 'POST api/v1/store-stock valid stockType not provided in api url',
                    },
                    { status: 400 }
                );
        }
    } catch (error) {
        // console.error('Error posting store stock:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
