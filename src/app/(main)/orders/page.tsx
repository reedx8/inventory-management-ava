'use client';
import React, { useState, useEffect } from 'react';
import noOrdersPic from '/public/illustrations/emptyCart.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar} from '@/components/header-bar';

interface Item {
    id: number;
    name: string;
    due_date: string;
    units: string;
    order_qty: number | null;
    store_categ: string;
    // stage: string;
}

export default function Orders() {
    const [data, setData] = useState<Item[]>();

    return (
        <main>
            <HeaderBar pageName={'Orders'} />
            <section>
                <PagesNavBar />
            </section>
            {data && data?.length > 0 ? (
                <>
                    <p>Orders here...</p>
                </>
            ) : (
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
