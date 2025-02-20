import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { getBakeryDueTodayCount, getItemCount } from '@/db/queries/select';

export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    let dataRequested: string | null = searchParams.get('dataRequested');

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { response: { success: false, error: 'Unauthorized' } },
            { status: 401 }
        );
    }

    try {
        let response;
        if (dataRequested === 'bakeryDueToday') {
            response = await getBakeryDueTodayCount();
        } else if (dataRequested === 'itemCount') {
            response = await getItemCount();
        } else {
            return NextResponse.json(
                {
                    error: 'You need to pass "dataRequested" in API url with the data you need (eg bakeryDueToday)',
                },
                { status: 400 }
            );
        }

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
