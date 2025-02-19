'use client';
import React, { useState, useEffect } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import noMilkBreadPic from '/public/illustrations/groceries.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import OrdersTable from '@/app/(main)/orders/components/orders-table';
import { MilkBreadOrder } from '@/app/(main)/orders/types';
import { STORE_LOCATIONS, MILK_BREAD_VENDORS } from '@/components/types';

// export const STORE_NAMES = [
//     'Hall',
//     'Progress',
//     'Kruse',
//     'Orenco',
// ] as const;

const dummyData: MilkBreadOrder[] = [
    {
        id: 1,
        name: 'Whole Milk',
        units: '1 Gal',
        stock_count: 3,
        order_qty: null,
        store_name: STORE_LOCATIONS[1],
        price: 1.2,
        vendor_name: MILK_BREAD_VENDORS[0],
    },
    {
        id: 2,
        name: '2% Milk',
        units: '1 Gal',
        stock_count: 5,
        order_qty: null,
        store_name: STORE_LOCATIONS[3],
        price: 1.3,
        vendor_name: MILK_BREAD_VENDORS[0],
    },
    {
        id: 3,
        name: 'Soy Milk',
        units: '1 Gal',
        stock_count: 2,
        order_qty: null,
        store_name: STORE_LOCATIONS[1],
        price: 1.75,
        vendor_name: MILK_BREAD_VENDORS[0],
    },
    {
        id: 4,
        name: 'Sourdough Bread',
        units: '1 Loaf',
        stock_count: 1,
        order_qty: null,
        store_name: STORE_LOCATIONS[1],
        price: 2.25,
        vendor_name: MILK_BREAD_VENDORS[1],
    },
    {
        id: 5,
        name: 'Whole Wheat Bread',
        units: '1 Loaf',
        stock_count: 8,
        order_qty: null,
        store_name: STORE_LOCATIONS[3],
        price: 2.9,
        vendor_name: MILK_BREAD_VENDORS[1],
    },
];

// type Details = {
//     vendor: ;
// }

export default function MilkBread() {
    const [data, setData] = useState<MilkBreadOrder[] | undefined>(dummyData);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <main>
            <HeaderBar pageName={'Orders'} />
            <section>
                <PagesNavBar />
            </section>
            {data && !isLoading && data?.length > 0 && (
                <section>
                    <OrdersTable data={data} setData={setData} />
                </section>
            )}
            {data && !isLoading && data?.length === 0 && (
                <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noMilkBreadPic}
                        alt='no milk & bread orders pic'
                        width={250}
                        height={250}
                        className='drop-shadow-lg'
                    />
                    <p className='text-2xl text-neutral-600'>
                        No Milk & Bread Orders!
                    </p>
                    <p className='text-sm text-neutral-400'>
                        All orders have been completed
                    </p>
                    {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                </section>
            )}
        </main>
    );
}
