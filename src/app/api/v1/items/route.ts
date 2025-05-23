import { getCostUnit } from '@/db/queries/select';
import { updateCostUnit } from '@/db/queries/update';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
// import { ParsPayload } from '@/components/types';
export const dynamic = 'force-dynamic'; // no caching

// get cost unit for a vendor item
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const fetchData: string | null = searchParams.get('fetch');
    const categ: string | null = searchParams.get('categ');
    // const dow: string | null = searchParams.get('dow');
    // const categ: string | null = searchParams.get('categ');

    if (
        !fetchData ||
        fetchData !== 'costunit' ||
        !categ ||
        !['MILK', 'BREAD'].includes(categ)
    ) {
        return NextResponse.json(
            {
                error: 'GET api/v1/items requires fetch=costunit&categ=MILK|BREAD',
            },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await getCostUnit(categ);

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch Cost/Unit' },
            { status: 500 }
        );
    }
}

// update cost unit for a vendor item
export async function PUT(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const updateData: string | null = searchParams.get('update');
    const costUnitData = await request.json();

    if (!updateData || updateData !== 'costunit') {
        return NextResponse.json(
            { error: 'PUT api/v1/items requires update=costunit' },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await updateCostUnit(costUnitData);
        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update Cost/Unit' },
            { status: 500 }
        );
    }
}
