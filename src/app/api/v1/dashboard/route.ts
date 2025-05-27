import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import {
    getBakeryDueTodayCount,
    getItemCount,
    getStoreCount,
    getMilkBreadDueTodayCount,
} from '@/db/queries/select';
export const dynamic = 'force-dynamic'; // no caching

export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const fetchType: string | null = searchParams.get('fetch');
    const storeId: string | null = searchParams.get('storeId');
    const dow: string | null = searchParams.get('dow');
    // const todaysDate: string | null = searchParams.get('todaysDate');

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let response;
        if (fetchType === 'bakeryDueToday') {
            const storeIdInt = storeId === null ? 0 : parseInt(storeId);
            response = await getBakeryDueTodayCount(storeIdInt);
        } else if (fetchType === 'itemCount') {
            response = await getItemCount();
        } else if (fetchType === 'storeCount') {
            response = await getStoreCount();
        } else if (fetchType === 'all') {
            const storeIdInt = storeId === null ? 0 : parseInt(storeId);
            const [
                bakeryResponse,
                itemResponse,
                storeResponse,
                milkBreadResponse,
            ] = await Promise.all([
                getBakeryDueTodayCount(storeIdInt),
                getItemCount(),
                getStoreCount(),
                getMilkBreadDueTodayCount(storeIdInt, dow ?? ''),
            ]);
            response = {
                success: true,
                bakeryDueTodayCount: bakeryResponse.data ?? 0,
                itemCount: itemResponse.data ?? 0,
                storeCount: storeResponse.data ?? 0,
                milkBreadDueTodayCount: milkBreadResponse.data ?? 0,
            };
        } else {
            return NextResponse.json(
                {
                    error: 'GET api/v1/dashboard needs "fetch"',
                },
                { status: 400 }
            );
        }

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }
        // return NextResponse.json(response, { status: 200 });

        // console.log(response);

        // should prevent netlify from caching this response
        return new NextResponse(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
