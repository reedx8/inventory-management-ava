import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import {
    getBakeryDueTodayCount,
    getItemCount,
    getStoreCount,
} from '@/db/queries/select';
export const dynamic = 'force-dynamic'; // no caching

export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const fetchType: string | null = searchParams.get('fetch');
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
            response = await getBakeryDueTodayCount();
        } else if (fetchType === 'itemCount') {
            response = await getItemCount();
        } else if (fetchType === 'storeCount') {
            response = await getStoreCount();
        } else {
            return NextResponse.json(
                {
                    error: 'You need to pass "fetch" in API url with the data needed (eg bakeryDueToday)',
                },
                { status: 400 }
            );
        }

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }
        // return NextResponse.json(response, { status: 200 });

        // should prevent netlify from caching this response
        return new NextResponse(JSON.stringify(response), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
            },
        });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
