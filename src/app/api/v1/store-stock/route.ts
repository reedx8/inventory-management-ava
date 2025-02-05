import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { getWeeklyStock } from '@/db/queries/select';

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
        const stock = await getWeeklyStock(storeId); //
        return Response.json(stock);
    } catch (error) {
        console.error('Error fetching store stock:', error);
        return Response.json(
            { error: 'Failed to fetch store stock' },
            { status: 500 }
        );
    }
}
