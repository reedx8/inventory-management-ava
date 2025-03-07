'use client';
import { HeaderBar } from '@/components/header-bar';
import PagesNavBar from '@/components/pages-navbar';
import React, { useState, useEffect } from 'react';
import ListView from '@/components/listview';

// Squarespace API version 1.0 response
type ApiOrder = {
    id: string; // unique order id
    orderNumber: string; // unique order number
    lineItems: LineItem[]; // list of products actually ordered in the order
    testmode: boolean; // If `true`, the order is a test order created using a payment method in test mode.
    customerEmail: string;
    createdOn: string; // // ISO 8601 UTC date and time string; represents the moment when the order was placed.
    channel: string; // Where the order originated; possible values are: `web` and `pos`.
    fulfillmentStatus: string; // PENDING, FULFILLED, or CANCELLED. Orders made via Point of Sale are automatically fulfilled
    billingAddress: Address[];
    shippingAddress: Address[];
    refundedTotal: { value: string; currency: string };
    // firstName: string;
    // lastName: string;
};

// Product ordered in the order
type LineItem = {
    id: string;
    productId: string; // Unique product id (only reliable property to filter by category unfortunately)
    productName: string; // Name of product, eg "AVA Decaf"
    quantity: number;
    imageUrl: string; // URL of the primary image for the item.
};

type Address = {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    phone: string;
};

// Current list of Coffee bean product ids on squarespace site. See squarespace products API
// There is no category property in the API, hence used for quick filtering between cakes and coffee beans (for now)
const coffeeBeanProductIds = [
    '5e72e8c880d20849616fa0f8', // colombia
    '62b641a2f0e47433e1639029', // ava blend
    '62ba0412153ecc070bc7eb1e', // sumatra
    '62ba07d6b98ee165b4348f69', // india
    '62ba08a0f0e47433e1649770', // ethiopia
    '62ba0b3029e1736db10c3b8b', // brazil
    '62ba0c6129e1736db10c3c4a', // ava decaf
];
const cakeItemProductIds = ['67bf770abb34477609d0b4ff'];

export default function CakeOrders() {
    const [data, setData] = useState<ApiOrder[]>(); // will assign values only on matching properties
    // const [data, setData] = useState([] as any[]);
    // const [data, setData] = useState();
    // const [cakeItems, setCakeItems] = useState<ApiOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const cakeItems = data?.map((order) =>
    //     order.lineItems.filter(
    //         (item) => cakeItemProductIds.includes(item.productId)
    //     )
    // );

    // Pending cake orders from squarespace
    const cakeOrders = data?.filter(
        (order) =>
            // order.refundedTotal.value === '0.00' && // leave commented out during testing
            order.fulfillmentStatus === 'PENDING' && // leave commented out during testing?
            order.testmode === false &&
            order.channel === 'web' && // Needed since fulfillmentStatus=FULFILLED automatically when channel=pos, and we onyl want pending orders
            order.lineItems.some((item) =>
                cakeItemProductIds.includes(item.productId)
            )
    );

    useEffect(() => {
        const fetchSquarespaceOrders = async () => {
            try {
                const response = await fetch('/api/v1/squarespace-orders');
                const result = await response.json();
                if (!response.ok) {
                    throw new Error('Squarespace API request failed');
                }
                console.log(result.result);

                // TODO: filter out test items here
                setData(result.result);
            } catch (error) {
                const err = error as Error;
                console.log('fetchCakeOrders error: ', err);
                setData([]);
            }
            setIsLoading(false);
        };
        fetchSquarespaceOrders();
    }, []);

    // console.log(data);

    return (
        <main>
            <HeaderBar pageName={'Bakery'} />
            <div>
                <PagesNavBar />
            </div>
            {/* <h1>Cake Orders</h1> */}
            <section className='mb-6'>
                {
                    !isLoading && data && data.length > 0 && cakeOrders && (
                        <div className='flex flex-col'>
                            <h2 className='self-end'>Open Orders: {cakeOrders.length}</h2>
                            <ListView data={cakeOrders} />
                        </div>
                    )
                    // cakeOrders.map((order) => (
                    //     <div key={order.id}>
                    //         <p>{order.lineItems[0].productName}</p>
                    //     </div>
                    // ))
                }
            </section>
        </main>
    );
}
