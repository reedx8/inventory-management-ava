import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import {
    getMilkBreadStock,
    getWasteStock,
    getWeeklyStock,
} from '@/db/queries/select';
import { postMilkBreadStock } from '@/db/queries/update';

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
                return Response.json(weeklyStock);
            case 'milkBread':
                if (storeId) {
                    const milkBreadStock = await getMilkBreadStock(storeId);
                    return Response.json(milkBreadStock);
                }
                return Response.json(
                    { error: 'No storeId provided' },
                    { status: 400 }
                );
            case 'waste':
                if (storeId) {
                    const weeklyStock = await getWasteStock(storeId);
                    return Response.json(weeklyStock);
                }
                return Response.json(
                    { error: 'No storeId provided' },
                    { status: 400 }
                );
            default:
                return Response.json(
                    {
                        error: 'Invalid stockType: Provide a valid stockType through your api url',
                    },
                    { status: 400 }
                );
        }
        // const stock = await getWeeklyStock(storeId); //
        // return Response.json(stock);
    } catch (error) {
        console.error('Error fetching store stock:', error);
        return Response.json(
            { error: 'Failed to fetch store stock' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId'); // storeId = null for all stores
    const stockType: string | null = searchParams.get('stockType');
    const result = await request.json();

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
                    const milkBreadStock = await postMilkBreadStock(
                        storeId,
                        result
                    );
                    console.log('milkBreadStock: ', milkBreadStock);
                    if (!milkBreadStock.status) {
                        return Response.json(
                            { error: 'Failed to post milk/bread stock' },
                            { status: 400 }
                        );
                    }
                    return Response.json(milkBreadStock);
                }
                return Response.json(
                    { error: 'No storeId provided' },
                    { status: 400 }
                );
            // case 'waste':
            //     if (storeId) {
            //         const wasteStock = await postWasteStock(storeId);
            //         return Response.json(weeklyStock);
            //     }
            //     return Response.json({ error: 'No storeId provided' }, { status: 400 });
            default:
                return Response.json(
                    {
                        error: 'Invalid stockType: Provide a valid stockType through your api url',
                    },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error posting store stock:', error);
        return Response.json(
            { error: 'Failed posting store stock' },
            { status: 500 }
        );
    }
}
