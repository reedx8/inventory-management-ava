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
import { Milk, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import completePic from '/public/illustrations/complete.svg';
import { Input } from '@/components/ui/input';
import { useFormStatus } from 'react-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                            <Button
                                variant='myTheme3'
                                // disabled={isSubmittingBatch}
                            >
                                <Milk />
                                Milk & Bread
                            </Button>
                        }
                        isCollapsible={false}
                        description={`Perform stock counts on the following milk and bread
                        items every Monday and Thursday.`}
                    >
                        <SheetData storeId={userStoreId} />
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

function SheetData({ storeId }: { storeId: number }) {
    const [data, setData] = useState<StockItem[]>([]);
    // const [data, setData] = useState<StockItem[]>([
    //     {
    //         id: 1,
    //         name: 'Milk 1%',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 2,
    //         name: 'Milk 2%',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 3,
    //         name: 'Whole Wheat',
    //         units: '1 Loaf',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'BREAD',
    //     },
    //     {
    //         id: 4,
    //         name: 'Sourdough',
    //         units: '1 Loaf',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'BREAD',
    //     },
    //     {
    //         id: 5,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 6,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 7,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 8,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 9,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 10,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 11,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 12,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    //     {
    //         id: 13,
    //         name: 'Oat Milk',
    //         units: '1 Qt',
    //         count: null,
    //         store_id: 1,
    //         cron_categ: 'MILK',
    //     },
    // ]);
    const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // stop page from refreshing
        setFormFeedback(null);
        console.log(data);

        if (data.some((item) => item.count === null)) {
            setFormFeedback('Please fill in all fields before submitting');
            return;
        }

        setIsSubmitting(true);

        //...submit data here

        setIsSubmitting(false);
    };

    return (
        <div className='flex flex-col h-full'>
            {data && data.length === 0 && (
                <div className='flex flex-col items-center justify-center gap-2'>
                    <Image
                        src={completePic}
                        alt='complete'
                        width={200}
                        height={200}
                    />
                    <p className='text-md text-gray-600'>
                        No milk or bread due!
                    </p>
                </div>
            )}
            {data && data.length > 0 && (
                <form
                    className='flex flex-col gap-2 mt-2'
                    onSubmit={handleSubmit}
                >
                    <ScrollArea className='max-h-[60vh] overflow-y-auto'>
                        <div className='grid grid-cols-1 gap-2 pr-4'>
                            {data.map((item) => (
                                <div
                                    key={item.id}
                                    className='flex justify-between h-fit items-center mt-1'
                                >
                                    <p>{item.name}</p>
                                    <input
                                        name='count'
                                        type='number'
                                        id={item.id.toString()}
                                        className='w-16 rounded-sm border-2 h-8'
                                        placeholder='0'
                                        step={0.5}
                                        onChange={(e) =>
                                            setData((prev) =>
                                                prev.map((p) =>
                                                    p.id === item.id
                                                        ? {
                                                              ...p,
                                                              count: Number(
                                                                  e.target.value
                                                              ),
                                                          }
                                                        : p
                                                )
                                            )
                                        }
                                        // onFocus and onClick allows consistent selection of all text in input field
                                        onFocus={(e) => {
                                            setTimeout(() => {
                                                e.target.select();
                                            }, 0);
                                        }}
                                        onClick={(e) =>
                                            (
                                                e.target as HTMLInputElement
                                            ).select()
                                        }
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className='flex flex-col gap-1 w-full'>
                        <SubmitButton
                            idleText='Submit'
                            loadingText='Submitting...'
                            isSubmitting={isSubmitting}
                        />
                        {formFeedback && (
                            <div className='flex justify-center'>
                                <p className='text-red-500 text-sm'>
                                    {formFeedback}
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
function SubmitButton({
    idleText,
    loadingText,
    isSubmitting,
}: {
    idleText: string;
    loadingText: string;
    isSubmitting: boolean;
}) {
    const { pending } = useFormStatus();

    return (
        <>
            <Button
                type='submit'
                className='h-12 text-md flex items-center w-full'
                variant='myTheme'
                disabled={isSubmitting}
            >
                <Send /> {pending ? loadingText : idleText}
            </Button>
        </>
    );
}
