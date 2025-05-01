'use client';
import { HeaderBar } from '@/components/header-bar';
import PagesNavBar from '@/components/pages-navbar';
// import React, { useState, useEffect } from 'react';
// import ListView from '@/components/listview';
import { ComingSoon, NoOrders } from '@/components/placeholders';
// import { Skeleton } from '@/components/ui/skeleton';

// Squarespace API version 1.0 response
// type ApiOrder = {
//     id: string; // unique order id
//     orderNumber: string; // unique order number
//     lineItems: LineItem[]; // list of products actually ordered in the order
//     testmode: boolean; // If `true`, the order is a test order created using a payment method in test mode.
//     customerEmail: string;
//     createdOn: string; // // ISO 8601 UTC date and time string; represents the moment when the order was placed.
//     channel: string; // Where the order originated; possible values are: `web` and `pos`.
//     fulfillmentStatus: string; // PENDING, FULFILLED, or CANCELLED. Orders made via Point of Sale are automatically fulfilled
//     billingAddress: Address[];
//     shippingAddress: Address[];
//     refundedTotal: { value: string; currency: string };
// };

// Product ordered in the order
// type LineItem = {
//     id: string;
//     productId: string; // Unique product id (only reliable property to filter by category unfortunately)
//     productName: string; // Name of product, eg "AVA Decaf"
//     quantity: number;
//     imageUrl: string; // URL of the primary image for the item.
// };

// type Address = {
//     firstName: string;
//     lastName: string;
//     address1: string;
//     address2: string;
//     city: string;
//     state: string;
//     phone: string;
// };

export default function CakeOrders() {
    // const [data, setData] = useState<ApiOrder[]>(); // will assign values only on matching properties
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     const fetchSquarespaceCakeOrders = async () => {
    //         try {
    //             const response = await fetch(
    //                 '/api/v1/squarespace-orders?fetch=cakes'
    //             );
    //             const result = await response.json();
    //             if (!response.ok) {
    //                 throw new Error('Squarespace API request failed');
    //             }
    //             console.log(result);
    //             // console.log(result.result);

    //             // TODO: filter out test items here
    //             setData(result);
    //             // setData(result.result);
    //         } catch (error) {
    //             const err = error as Error;
    //             console.log('fetchCakeOrders error: ', err);
    //             setData([]);
    //         }
    //         setIsLoading(false);
    //     };
    //     fetchSquarespaceCakeOrders();
    // }, []);

    // console.log(data);

    return (
        <main>
            <HeaderBar pageName={'Bakery'} />
            <div>
                <PagesNavBar />
            </div>
            <section className='mb-6'>
                <div className='flex flex-col justify-center items-center'>
                    <ComingSoon subtitle='Toast cake orders are coming soon' />
                </div>
            </section>
            {/* Squarespace Cake orders no longer used, switched to Toast*/}
            {/* <section className='mb-6'>
                {isLoading && !data && (
                    <div className='flex gap-3 py-3 pr-3'>
                        <div className='flex flex-col space-y-2 w-full'>
                            <Skeleton className='h-[90px] w-full rounded-xl' />
                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-[80%]' />
                                <Skeleton className='h-4 w-[60%]' />
                            </div>
                        </div>
                    </div>
                )}
                {!isLoading && data && data.length > 0 && (
                    <div className='flex flex-col'>
                        <h2 className='self-end'>Open Orders: {data.length}</h2>
                        <ListView data={data} />
                    </div>
                )}
                {!isLoading && data && data.length === 0 && (
                    <div className='flex flex-col justify-center items-center'>
                        <NoOrders subtitle='No open cake orders' />
                    </div>
                )}
            </section> */}
        </main>
    );
}
