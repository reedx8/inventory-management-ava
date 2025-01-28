'use client';
import React, { useState, useEffect } from 'react';
import noOrdersPic from '/public/illustrations/emptyCart.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PagesNavBar from '@/components/pages-navbar';

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
    const [data, setData] = useState<Item[]>([]);

    return (
        <div className='mt-6'>
            <div>
                <h1 className='text-3xl'>Orders</h1>
            </div>
            <div className='mb-6'>
                <PagesNavBar />
            </div>
            {data?.length > 0 ? (
                <>
                    <p>Orders here...</p>
                </>
            ) : (
                <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noOrdersPic}
                        alt='all orders complete pic'
                        width={250}
                        height={250}
                    />
                    <p className='text-xl text-gray-600'>
                        All Orders Complete!
                    </p>
                    <p className='text-sm text-gray-400'>
                        This week's orders have been processed
                    </p>
                    <Button size='lg' variant='myTheme'>Create Order</Button>
                </div>
            )}
        </div>
    );
}
