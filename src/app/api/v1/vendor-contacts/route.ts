import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { getVendorContacts } from '@/db/queries/select';

export async function GET(request: NextRequest) {
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
        const response = await getVendorContacts();

        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
