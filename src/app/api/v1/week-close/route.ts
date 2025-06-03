import {
    getMeatWeekClose,
    getPastryWeekClose,
    getRetailWeekClose,
} from '@/db/queries/select';
import { insertUpdateWeekClose } from '@/db/queries/insert';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
export const dynamic = 'force-dynamic'; // no caching

// get week close data for a store
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId');
    let categ: string | null = searchParams.get('categ');
    const subCateg: string | null = searchParams.get('subCateg');

    if (!storeId || !categ || !subCateg) {
        return NextResponse.json(
            {
                error: 'GET api/v1/week-close requires valid storeId, item category, and sub-category',
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
        let response;
        categ = categ.toUpperCase();
        if (categ === 'MEAT') {
            response = await getMeatWeekClose(Number(storeId), subCateg);
        } else if (categ === 'PASTRY') {
            response = await getPastryWeekClose(Number(storeId));
        } else if (categ === 'RETAIL') {
            response = await getRetailWeekClose(Number(storeId), subCateg);
        } else {
            return NextResponse.json(
                { error: 'GET api/v1/week-close requires valid item category' },
                { status: 400 }
            );
        }

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
            { error: 'Failed to fetch week close data' },
            { status: 500 }
        );
    }
}

// insert week close data for a store
export async function POST(request: NextRequest) {
    // const searchParams: URLSearchParams = request.nextUrl.searchParams;
    // const storeId: string | null = searchParams.get('storeId');
    // const categ: string | null = searchParams.get('categ');
    // const subCateg: string | null = searchParams.get('subCateg');
    const { data, subCateg } = await request.json();

    if (!data || !subCateg) {
        return NextResponse.json(
            { error: 'POST api/v1/week-close requires data and sub-category' },
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
        const response = await insertUpdateWeekClose(data, subCateg);

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
