import { getDailyParLevels, getWeeklyParLevels } from '@/db/queries/select';
import {
    updateDailyParLevels,
    updateWeeklyParLevels,
} from '@/db/queries/update';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
// import { ParsPayload } from '@/components/types';
export const dynamic = 'force-dynamic'; // no caching

// get daily PAR levels for a store
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const storeId: string | null = searchParams.get('storeId');
    const dow: string | null = searchParams.get('dow');
    const categ: string | null = searchParams.get('categ');
    if (dow && dow.toLowerCase() !== 'weekly') {
        const validDays = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ];
        if (!dow || !validDays.includes(dow.toLowerCase())) {
            return NextResponse.json(
                {
                    error: 'GET api/v1/pars requires a valid day of week (eg monday)',
                },
                { status: 400 }
            );
        }
    }

    if (!storeId || !dow || !categ) {
        return NextResponse.json(
            {
                error: 'GET api/v1/pars requires valid storeId, day of week, and item category',
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
        if (dow.toLowerCase() === 'weekly') {
            response = await getWeeklyParLevels(
                Number(storeId),
                categ.toUpperCase()
            );
        } else {
            response = await getDailyParLevels(
                Number(storeId),
                dow.toLowerCase(),
                categ.toUpperCase()
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
            { error: 'Failed to fetch PAR levels' },
            { status: 500 }
        );
    }
}

// update daily PAR levels for a store
export async function PUT(request: NextRequest) {
    // const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const payload = await request.json();
    let { data, dow } = payload;

    if (!data || !dow) {
        return NextResponse.json(
            { error: 'PUT api/v1/pars requires data and dow' },
            { status: 400 }
        );
    }

    if (data.length === 0 || dow.length === 0) {
        return NextResponse.json(
            { error: 'PUT api/v1/pars requires data and dow' },
            { status: 400 }
        );
    }

    if (dow.toLowerCase() !== 'weekly') {
        dow = dow.toLowerCase();
        const validDays = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ];

        if (!validDays.includes(dow)) {
            return NextResponse.json(
                {
                    error: 'PUT api/v1/pars requires a valid day of week (eg monday)',
                },
                { status: 400 }
            );
        }
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
        if (dow.toLowerCase() === 'weekly') {
            response = await updateWeeklyParLevels({ data, dow });
        } else {
            response = await updateDailyParLevels({ data, dow });
        }
        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update PAR levels' },
            { status: 500 }
        );
    }
}
