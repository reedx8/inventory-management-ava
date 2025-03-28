'use client';
// import StoreNavsBar from '@/components/pages-navbar';
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
// import { Dot } from 'lucide-react';
// import noStockPic from '/public/illustrations/empty.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import { useAuth } from '@/contexts/auth-context';
import PagesNavBar from '@/components/pages-navbar';
import { Skeleton } from '@/components/ui/skeleton';
// import ItemsTable from '@/components/items-table';
import StockTable from './components/stock-table';
import TrackWasteSheet from './components/track-waste-sheet';
import MilkBreadSheet from './components/milk-bread-sheet';
import { NoStockDue } from '@/components/placeholders';

interface StockItem {
    id: number;
    name: string;
    due_date: string;
    units: string;
    count: number | null;
    store_categ: string;
    store_name: string;
}

const dummyData: StockItem[] = [
    {
        id: 1,
        name: 'TOUCHSTONE WHOLE',
        due_date: '2025-06-15',
        units: '1 Pc',
        count: 0,
        store_categ: 'FRIDGE',
        store_name: 'Progress',
    },
    {
        id: 2,
        name: 'TOUCHSTONE 2%',
        due_date: '2025-06-15',
        units: '22 lb',
        count: 0,
        store_categ: 'FRIDGE',
        store_name: 'Orenco',
    },
    {
        id: 3,
        name: 'TOUCHSTONE FAT-FREE',
        due_date: '2025-06-15',
        units: 'Bucket (16 lb)',
        count: 0,
        store_categ: 'FRIDGE',
        store_name: 'Progress',
    },
    {
        id: 4,
        name: 'Ciabbatte Rolls',
        due_date: '2025-06-15',
        units: '12/pack',
        count: 0,
        store_categ: 'FRIDGE',
        store_name: 'Progress',
    },
    {
        id: 5,
        name: 'Olive Oil',
        due_date: '2025-06-15',
        units: '1 bottle',
        count: 0,
        store_categ: 'GENERAL',
        store_name: 'Orenco',
    },
    {
        id: 6,
        name: 'Potato Chips',
        due_date: '2025-06-15',
        units: '1.5 oz',
        count: 0,
        store_categ: 'STOCKROOM',
        store_name: 'Orenco',
    },
    {
        id: 7,
        name: 'Sumatra',
        due_date: '2025-06-15',
        units: '1 lb',
        count: 0,
        store_categ: 'BEANS&TEA',
        store_name: 'Progress',
    },
];

export default function Stock() {
    const [data, setData] = useState<StockItem[] | undefined>();
    const { userRole, userStoreId } = useAuth();
    // const [activeCateg, setActiveCateg] = useState<string>('PASTRY');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWeeklyStock = async () => {
            try {
                let response;
                if (userRole === 'admin') {
                    // fetch every store (no storeId param in api url)
                    response = await fetch('/api/v1/store-stock');
                } else if (userRole === 'store_manager') {
                    // fetch single store
                    response = await fetch(
                        `/api/v1/store-stock?storeId=${userStoreId}`
                    );
                } else {
                    // dont fetch stock for other roles
                    return;
                }
                const data = await response.json();
                if (response.ok) {
                    setData(data); // set data to all stores
                    // setStoreData(data);
                } else {
                    console.error('Error fetching stock: ', data);
                    setData([]);
                    // setStoreData([]);
                }
            } catch (error) {
                console.error('Error fetching stock: ', error);
                setData([]);
                // setStoreData([]);
            }
            setIsLoading(false);
        };

        // fetchWeeklyStock();

        // testing:
        setData([]);
        setIsLoading(false);
        // console.log('Store stock fetched');
    }, [userRole, userStoreId]);

    // testing:
    // console.log('the data: ', data);

    return (
        <main>
            <HeaderBar pageName={'Store'} />
            <section className='flex justify-between items-center'>
                <PagesNavBar />
                <div className='flex gap-2'>
                    <MilkBreadSheet />
                    <TrackWasteSheet />
                </div>
            </section>
            {data === undefined && isLoading && (
                <section className='flex flex-col w-[90%] gap-3'>
                    <div className='space-y-2'>
                        <Skeleton className='h-6 w-[100%] rounded-md' />
                        {/* <Skeleton className='h-4 w-[200px]' /> */}
                    </div>
                    <Skeleton className='h-[175px] w-[100%] rounded-md' />
                    <div className='flex gap-2 self-end'>
                        <Skeleton className='h-6 w-[75px] round-md' />
                        <Skeleton className='h-6 w-[75px] round-md' />
                    </div>
                </section>
                // <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                // <p className='text-2xl text-gray-600'>Loading...</p>
                // </div>
            )}
            {data && !isLoading && data?.length > 0 && (
                <StockTable/>
                // <StockTable data={data} setData={setData} />
            )}
            {!isLoading && data?.length === 0 && (
                // <div className='flex flex-col justify-center'>
                <section className='flex justify-center'>
                    <NoStockDue />
                </section>
                // </div>
            )}
        </main>
    );
}
