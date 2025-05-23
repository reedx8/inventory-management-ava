'use client';
import React, { useEffect, useState } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import noMilkBreadPic from '/public/illustrations/groceries.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import OrdersTable from '@/app/(main)/orders/components/orders-table';
import { MilkBreadOrder } from '@/app/(main)/orders/types';
import { STORE_LOCATIONS, MILK_BREAD_VENDORS } from '@/components/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import SheetTemplate from '@/components/sheet/sheet-template';
import { Button } from '@/components/ui/button';
import SheetData from '../components/sheet-data';
import { DollarSign, Edit2 } from 'lucide-react';
import SheetDataCostUnit from '../components/sheet-data-costunit';

// const dummyData: MilkBreadOrder[] = [
//     {
//         id: 1,
//         name: 'Whole Milk',
//         units: '1 Gal',
//         stock_count: 3,
//         order_qty: 0,
//         store_name: STORE_LOCATIONS[1],
//         store_id: 1,
//         cpu: 1.2,
//         vendor_name: MILK_BREAD_VENDORS[0],
//         category: 'Milk',
//         par: 3,
//         item_code: '1234567890',
//         order_submitted: false,
//     },
//     {
//         id: 2,
//         name: '2% Milk',
//         units: '1 Gal',
//         stock_count: 5,
//         order_qty: 0,
//         store_name: STORE_LOCATIONS[3],
//         store_id: 1,
//         cpu: 1.3,
//         vendor_name: MILK_BREAD_VENDORS[0],
//         category: 'Milk',
//         par: 5,
//         item_code: '1234567890',
//         order_submitted: false,
//     },
//     {
//         id: 3,
//         name: 'Soy Milk',
//         units: '1 Gal',
//         stock_count: 2,
//         order_qty: 0,
//         store_name: STORE_LOCATIONS[1],
//         store_id: 1,
//         cpu: 1.75,
//         vendor_name: MILK_BREAD_VENDORS[0],
//         category: 'Milk',
//         par: 1,
//         item_code: '1234567890',
//         order_submitted: false,
//     },
//     {
//         id: 4,
//         name: 'Sourdough Bread',
//         units: '1 Loaf',
//         stock_count: 1,
//         order_qty: 0,
//         store_name: STORE_LOCATIONS[1],
//         store_id: 1,
//         cpu: 2.25,
//         vendor_name: MILK_BREAD_VENDORS[1],
//         category: 'Bread',
//         par: 2,
//         item_code: '1234567890',
//         order_submitted: false,
//     },
//     {
//         id: 5,
//         name: 'Whole Wheat Bread',
//         units: '1 Loaf',
//         stock_count: 8,
//         order_qty: 0,
//         store_name: STORE_LOCATIONS[3],
//         store_id: 1,
//         cpu: 2.9,
//         vendor_name: MILK_BREAD_VENDORS[1],
//         category: 'Bread',
//         par: 1,
//         item_code: '1234567890',
//         order_submitted: false,
//     },
// ];

export default function MilkBread() {
    const [data, setData] = useState<MilkBreadOrder[]>([]); // fetch all stores data
    // const [data, setData] = useState<MilkBreadOrder[] | undefined>(dummyData); // fetch all stores data
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [storeId, setStoreId] = useState<number>(1);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            // setIsLoading(true);
            try {
                const response = await fetch('/api/v1/milk-bread?fetch=stock');
                const data = await response.json();
                if (!response.ok) {
                    // console.log(data.error);
                    throw new Error(data.error);
                }

                setData(data);
            } catch (error) {
                // console.error('ERROR: ' + error);
                let errMsg;
                if (String(error).length > 100) {
                    errMsg = String(error).slice(0, 100) + '...';
                } else {
                    errMsg = String(error);
                }
                toast({
                    title: 'Error fetching data',
                    description: errMsg,
                    variant: 'destructive',
                });
            }
            setIsLoading(false);
        };

        // TODO: fetch data only on mondays and thursdays?
        fetchData();
    }, [refreshTrigger]);

    return (
        <main>
            <HeaderBar pageName={'Orders'} />
            <section className='flex justify-between'>
                <PagesNavBar />
                <div className='flex gap-2 items-center'>
                    <SheetTemplate
                        trigger={
                            <Button variant={'myTheme3'} className='text-xs'>
                                <DollarSign className='w-4 h-4' /> Edit Cost/Unit
                            </Button>
                        }
                        title={'Edit Cost/Unit'}
                        description={
                            'Edit the cost/unit of milk and bread items'
                        }
                    >
                        <SheetDataCostUnit
                            contentType={'costunit'}
                            setRefreshTrigger={setRefreshTrigger}
                        />
                    </SheetTemplate>
                    <SheetTemplate
                        trigger={
                            <Button variant={'myTheme3'} className='text-xs'>
                                <Edit2 className='w-4 h-4' /> Edit PARS
                            </Button>
                        }
                        title={'Edit PAR levels'}
                        description={
                            'Edit the PAR levels of milk and bread items'
                        }
                    >
                        <SheetData
                            contentType={'pars:weekly'}
                            setRefreshTrigger={setRefreshTrigger}
                        />
                    </SheetTemplate>
                </div>
            </section>
            {isLoading && data.length === 0 && (
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
            {!isLoading && data && data.length > 0 && (
                <section>
                    <OrdersTable
                        data={data}
                        setData={setData}
                        storeId={storeId}
                        setStoreId={setStoreId}
                        setRefreshTrigger={setRefreshTrigger}
                    />
                </section>
            )}
            {!isLoading && data && data.length === 0 && (
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
