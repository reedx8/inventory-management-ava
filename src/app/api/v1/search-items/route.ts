import { searchItems } from '@/db/queries/select';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const query: string | null = searchParams.get('query');

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // return Response.redirect('/login');
    }

    try {
        const items = await searchItems(query as string);
        return Response.json(items);
    } catch (error) {
        console.error('Error fetching search items: ', error);
        return Response.json(
            { error: 'Failed to fetch search items' },
            { status: 500 }
        );
    }
}
