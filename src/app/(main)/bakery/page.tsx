'use client';
import React, { useState, useEffect } from 'react';
import noPastriesPic from '/public/illustrations/cooking.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import { BakeryOrder } from '@/app/(main)/bakery/types';
import { BakeryColumns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';

const dummyData: BakeryOrder[] = [
    {
        id: 1,
        name: 'Peach & Cream Cheese Turnover',
        units: '1 Pc',
        order_qty: 23,
        is_complete: false,
    },
    {
        id: 2,
        name: 'Blueberry Muffin',
        units: '1 Pc',
        order_qty: 18,
        is_complete: false,
    },
    {
        id: 3,
        name: 'Croissant',
        units: '1 Pc',
        order_qty: undefined,
        is_complete: false,
    },
    {
        id: 4,
        name: 'Cheese Bagel',
        units: '4 Pcs/Pack',
        order_qty: 12,
        is_complete: false,
    },
    {
        id: 5,
        name: 'Strawberry Whip Cream Cake (Quarter)',
        units: '1/4 Cake',
        order_qty: 29,
        is_complete: false,
    },
    {
        id: 6,
        name: 'Chocolate Chip Muffin',
        units: '1 Pc',
        order_qty: 44,
        is_complete: false,
    },
    {
        id: 7,
        name: 'Pecan Cranberry Muffin',
        units: '1 Pc',
        order_qty: undefined,
        is_complete: false,
    },
    {
        id: 8,
        name: 'Zu Zus',
        units: '12 Pcs/Pack',
        order_qty: 2,
        is_complete: false,
    },
    {
        id: 9,
        name: 'Napoleon',
        units: '1 Pc',
        order_qty: undefined,
        is_complete: false,
    },
    {
        id: 10,
        name: 'Macaroon',
        units: '1 Pc',
        order_qty: 16,
        is_complete: false,
    },
    {
        id: 11,
        name: 'Fruit Tart',
        units: '1 Pc',
        order_qty: 67,
        is_complete: false,
    },
];

export default function Bakery() {
    const [data, setData] = useState<BakeryOrder[] | undefined>();
    // const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getBakerysOrders = async () => {
            try {
                const response = await fetch('/api/v1/bakerys-orders');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                setData(data);
            } catch (error) {
                console.error('Error fetching bakerys orders:', error);
            }
        };

        getBakerysOrders();
    }, []);

    return (
        <main>
            <HeaderBar pageName={'Bakery'} />
            <div className='mb-6'>{/* <StoreNavsBar /> */}</div>
            {data && data?.length > 0 && (
                <>
                    <DataTable columns={BakeryColumns} data={data} />
                </>
            )}
            {data && data?.length === 0 && (
                <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noPastriesPic}
                        alt='no pastries pic'
                        width={250}
                        height={250}
                        className='drop-shadow-lg'
                    />
                    <p className='text-2xl text-gray-600'>No Pastries Due!</p>
                    <p className='text-sm text-gray-400'>
                        All pastries have been delivered today
                    </p>
                    {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                </div>
            )}
        </main>
    );
}
