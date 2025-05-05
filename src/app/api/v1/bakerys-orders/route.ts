import { getBakerysOrders } from '@/db/queries/select';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import {
    putBakeryBatchCompleteOrders,
    putBakeryEditOrders,
} from '@/db/queries/update';
export const dynamic = 'force-dynamic'; // no caching

// Bakery Staff: Get store's bakery orders, or total bakery orders per item, from the database
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    let storeLocation: string | null = searchParams.get('storeLocation');

    if (storeLocation) {
        storeLocation = storeLocation.toLowerCase();
    }
    console.log('storeLocation: ', storeLocation);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { response: { success: false, error: 'Unauthorized' } },
            { status: 401 }
        );
        // return Response.redirect('/login');
    }

    try {
        let response;
        // console.log('storeLocation: ', storeLocation);
        switch (storeLocation) {
            case 'hall':
                response = await getBakerysOrders(1);
                // response.success = true;
                break;
            case 'progress':
            case 'barrows':
                response = await getBakerysOrders(2);
                break;
            case 'kruse':
                response = await getBakerysOrders(3);
                break;
            case 'orenco':
                response = await getBakerysOrders(4);
                break;
            case 'tigard':
                response = await getBakerysOrders(5);
                break;
            default:
                // get total orders per item instead, summed across all stores
                response = await getBakerysOrders();
                break;
        }
        if (!response.success) {
            return NextResponse.json(response, { status: 400 });
        }

        // should prevent netlify from caching this response
        return new NextResponse(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });

        // return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        const err = error as Error;
        // console.error('Error fetching bakerys orders: ', error);
        return NextResponse.json(
            { response: { success: false, error: err.message } },
            { status: 500 }
        );
    }
}

// Send bakery's completed orders to the database
export async function PUT(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    let submitType: string | null = searchParams.get('submitType');
    const completedOrders = await request.json();

    if (submitType) {
        submitType = submitType.toLowerCase();
    }

    // console.log('storeId: ', storeId);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { response: { success: false, message: 'Unauthorized' } },
            { status: 401 }
        );
        // return Response.redirect('/login');
    }

    try {
        let response;
        if (submitType === 'batch') {
            response = await putBakeryBatchCompleteOrders();
        } else if (submitType === 'edit') {
            response = await putBakeryEditOrders(completedOrders);
        } else {
            return NextResponse.json(
                {
                    response: {
                        success: false,
                        error: "You need to pass either 'edit' or 'batch' in submitType query param",
                    },
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
        return NextResponse.json(
            { response: { success: false, message: err.message } },
            { status: 500 }
        );
    }
}
