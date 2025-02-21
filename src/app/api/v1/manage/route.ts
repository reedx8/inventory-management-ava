import { getAllItems } from '@/db/queries/select';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

// mange page: get all items
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const dataRequested: string | null = searchParams.get('fetch');

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let response;

        if (dataRequested === 'allItems') {
            response = await getAllItems();
        } else {
            return NextResponse.json(
                {
                    error: "You must pass 'fetch' in API url along with data requested (eg 'allItems')",
                },
                { status: 400 }
            );
        }

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch all items' },
            { status: 500 }
        );
    }
}
