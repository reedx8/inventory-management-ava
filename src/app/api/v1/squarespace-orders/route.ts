// import { getCakeOrders } from '@/db/queries/select';
// import { NextResponse } from 'next/server';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

// Current list of Coffee bean product ids on squarespace site. See squarespace products API
// There is no category property in the API, hence (will be) used for quick filtering between cakes and coffee beans (for now)
const coffeeBeanProductIds = [
    '5e72e8c880d20849616fa0f8', // colombia
    '62b641a2f0e47433e1639029', // ava blend
    '62ba0412153ecc070bc7eb1e', // sumatra
    '62ba07d6b98ee165b4348f69', // india
    '62ba08a0f0e47433e1649770', // ethiopia
    '62ba0b3029e1736db10c3b8b', // brazil
    '62ba0c6129e1736db10c3c4a', // ava decaf
];

// Fetches orders from squarespace site
// Concentrates cake order logic here, downside to that is not adhering to MVC pattern
export async function GET(request: NextRequest) {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const fetchType: string | null = searchParams.get('fetch'); // cakes, or beans
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
        // Get ALL orders made on squarespace site
        const response = await fetch(
            'https://api.squarespace.com/1.0/commerce/orders',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + process.env.SQUARESPACE_API_KEY,
                    'User-Agent': 'IMS',
                },
            }
        );
        const data = await response.json();

        let processedData;

        if (fetchType === 'cakes') {
            // return count of all pending cake orders made on squarespace site
            const cakeItemProductIds = ['67bf770abb34477609d0b4ff']; // squareapce product ids for cakes
            const cakeOrders = data?.result.filter(
                (order) =>
                    // order.refundedTotal.value === '0.00' && // leave commented out during testing
                    order.fulfillmentStatus === 'PENDING' && // leave commented out during testing?
                    order.testmode === false &&
                    order.channel === 'web' && // Needed since fulfillmentStatus=FULFILLED automatically when channel=pos, and we onyl want pending orders
                    order.lineItems.some((item) =>
                        cakeItemProductIds.includes(item.productId)
                    )
            );
            processedData = cakeOrders;
        } else {
            processedData = data;
        }
        // } else if (fetchType === 'beans') {
        // }

        if (!response.ok) {
            return NextResponse.json(response, { status: 400 });
        }
        return NextResponse.json(processedData, { status: 200 });
        // return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // console.error('Error fetching store orders:', error);
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
