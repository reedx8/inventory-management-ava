'use client';
import React, { useEffect, useState } from 'react';
import noOrdersPic from '/public/illustrations/emptyCart.svg';
import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItem {
    id: number;
    name: string;
    due_date: string;
    units: string;
    order_qty: number | null;
    store_categ: string;
    // stage: string;
}

export default function Orders() {
    const [data, setData] = useState<OrderItem[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // setData([]);
        const myPromise = new Promise((resolve) => {
            setTimeout(() => {
                setIsLoading(false);
                setData([]);
            }, 2000);
        });
        // myPromise.then(() => setIsLoading(false));
    }, []);

    return (
        <main>
            <HeaderBar pageName={'Orders'} />
            <section>
                <PagesNavBar />
            </section>
            {isLoading && !data && (
                <section className='flex flex-col gap-3'>
                    <Skeleton className='h-12 w-[80%]' />
                    <Skeleton className='h-6 w-[80%]' />
                    <Skeleton className='h-6 w-[65%]' />
                    <Skeleton className='h-6 w-[50%]' />
                </section>
            )}
            {!isLoading && data && data?.length > 0 && (
                <>
                    <p>Orders here...</p>
                </>
            )}
            {!isLoading && data && data?.length <= 0 && (
                <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noOrdersPic}
                        alt='all orders complete pic'
                        width={250}
                        height={250}
                        className='drop-shadow-lg rounded-3xl'
                    />
                    <p className='text-2xl text-gray-600'>
                        All Orders Completed!
                    </p>
                    <p className='text-sm text-gray-400'>
                        {`This week's orders have been completed`}
                    </p>
                    {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                </section>
            )}
        </main>
    );
}
