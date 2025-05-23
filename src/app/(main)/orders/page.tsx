'use client';
import React, { useEffect, useRef, useState } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { NoOrders } from '@/components/placeholders';
// import { useAuth } from '@/contexts/auth-context';

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
    const [data, setData] = useState<any[]>();
    // const [data, setData] = useState<OrderItem[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [testData, setTestData] = useState<any[]>();
    // const { userStoreId, userRole } = useAuth();

    useEffect(() => {
        // setData([]);
        setIsLoading(true)
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
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                </section>
            )}
            {!isLoading && data && data?.length > 0 && (
                <>
                    <p>Orders here...</p>
                </>
            )}
            {!isLoading && data && data?.length <= 0 && (
                <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <NoOrders
                        subtitle={`This week's orders have been completed`}
                    />
                </section>
            )}
        </main>
    );
}
