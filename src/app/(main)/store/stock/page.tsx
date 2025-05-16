'use client';
// import StoreNavsBar from '@/components/pages-navbar';
import React, { useState, useEffect } from 'react';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     useReactTable,
// } from '@tanstack/react-table';
// import { Dot } from 'lucide-react';
// import noStockPic from '/public/illustrations/empty.svg';
// import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import { useAuth } from '@/contexts/auth-context';
import PagesNavBar from '@/components/pages-navbar';
import { Skeleton } from '@/components/ui/skeleton';
// import ItemsTable from '@/components/items-table';
import StockTable from './components/stock-table';
// import TrackWasteSheet from './components/track-waste-sheet';
// import MilkBreadSheet from './components/milk-bread-sheet';
import { NoStockDue } from '@/components/placeholders';
import SheetTemplate from '@/components/sheet/sheet-template';
import { Milk } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import completePic from '/public/illustrations/complete.svg';
// import { Input } from '@/components/ui/input';
// import { useFormStatus } from 'react-dom';
// import { ScrollArea } from '@/components/ui/scroll-area';
import SheetData from '@/components/sheet/sheet-data';
// import { useToast } from '@/hooks/use-toast';
type StockItem = {
    id: number;
    name: string;
    // due_date: string;
    units: string;
    count: number | null;
    store_id: number;
    cron_categ: string;
    store_categ?: string;
};

export default function Stock() {
    const [data, setData] = useState<StockItem[] | undefined>();
    const { userRole, userStoreId } = useAuth();
    // const [activeCateg, setActiveCateg] = useState<string>('PASTRY');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const { toast } = useToast();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                    {/* <SheetTemplate
                        title='Milk & Bread Stock'
                        trigger={
                            <Button variant='myTheme3'>
                                <Milk />
                                <p className='text-xs'>Milk & Bread</p>
                            </Button>
                        }
                        isCollapsible={false}
                        description={`Perform stock counts on the following milk and bread
                        items every Monday and/or Thursday.`}
                    >
                        <SheetData
                            storeId={userStoreId}
                            contentType='store:milk'
                        />
                    </SheetTemplate> */}
                    {/* <MilkBreadSheet /> */}
                    {/* <TrackWasteSheet /> */}
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
                <StockTable />
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
