'use client';
import PagesNavBar from '@/components/pages-navbar';
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
import { Skeleton } from '@/components/ui/skeleton';
// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     useReactTable,
// } from '@tanstack/react-table';
// import { Dot } from 'lucide-react';
import { HeaderBar } from '@/components/header-bar';
import { useAuth } from '@/contexts/auth-context';
import OrderTable from './components/order-table';
import { OrderItem } from '@/app/(main)/store/types';
import { NoStoreOrdersDue } from '@/components/placeholders';
// import { getStoreOrders } from '@/db/queries/select';
// import { init } from 'next/dist/compiled/webpack/webpack';
// import next from 'next';

// const STORE_CATEGORIES = [
//     'ALL',
//     'PASTRY',
//     'FRONT',
//     'GENERAL',
//     'FRIDGE',
//     'STOCKROOM',
//     'BEANS&TEA',
// ] as const;

// const dummyData: OrderItem[] = [
//     {
//         id: 1,
//         name: 'Strawberry & Cream Cheese Turnover',
//         due_date: '2025-06-15',
//         qty_per_order: '1 Pc',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Progress',
//     },
//     {
//         id: 2,
//         name: 'Peach & Cream Cheese Turnover',
//         due_date: '2025-06-15',
//         qty_per_order: '1 Pc',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Progress',
//     },
//     {
//         id: 3,
//         name: 'Cream Cheese Turnover',
//         due_date: '2025-06-15',
//         qty_per_order: '1 Pc',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Orenco',
//     },
//     {
//         id: 4,
//         name: 'Sesame Bagel',
//         due_date: '2025-06-15',
//         qty_per_order: '4 Pcs/Pack',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Orenco',
//     },
//     {
//         id: 5,
//         name: 'Zu Zus',
//         due_date: '2025-06-15',
//         qty_per_order: '12 Pcs',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Progress',
//     },
//     {
//         id: 6,
//         name: 'Strawberry Whip Cream Cake (Full)',
//         due_date: '2025-06-15',
//         qty_per_order: '1 cake',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Progress',
//     },
//     {
//         id: 7,
//         name: 'Strawberry Whip Cream Cake (Half)',
//         due_date: '2025-06-15',
//         qty_per_order: '1/2 cake',
//         order: 0,
//         store_categ: 'PASTRY',
//         store_name: 'Orenco',
//     },
// ];

export default function Stores() {
    const { userRole, userStoreId } = useAuth();
    const [mergedData, setMergedData] = useState<OrderItem[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStoreOrders = async () => {
            try {
                let regResponse;
                let bakeryResponse;

                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tom_dow_num = tomorrow.getDay();

                if (userRole === 'admin') {
                    [regResponse, bakeryResponse] = await Promise.all([
                        fetch(`/api/v1/store-orders?dow=${tom_dow_num}`),
                        fetch(`/api/v1/store-bakery-orders?dow=${tom_dow_num}`),
                    ]);
                } else if (userRole === 'store_manager') {
                    [regResponse, bakeryResponse] = await Promise.all([
                        fetch(
                            `/api/v1/store-orders?storeId=${userStoreId}&dow=${tom_dow_num}`
                        ),
                        fetch(
                            `/api/v1/store-bakery-orders?storeId=${userStoreId}&dow=${tom_dow_num}`
                        ),
                    ]);
                } else {
                    // dont fetch orders for other roles
                    return;
                }

                const [regData, bakeryData] = await Promise.all([
                    regResponse.json(),
                    bakeryResponse.json(),
                ]);
                // const data = await response.json();
                // const theBakeryData = await response2.json();
                if (regResponse.ok && bakeryResponse.ok) {
                    const mergedOrders = [...regData, ...bakeryData];
                    setMergedData(mergedOrders);
                    console.log('mergedOrders: ', mergedOrders);
                } else {
                    throw new Error(
                        'Store Orders Error: ' +
                            (regData.error || 'Ok') +
                            `\nBakery Orders Error: ` +
                            (bakeryData.error || 'Ok')
                    );
                }
                //     console.error('Caught Error: ', regData.error, bakeryData.error, {
                //         regularOrders: regData,
                //         bakeryOrders: bakeryData,
                //     });
                //     setMergedData([]);
                // }
            } catch (error) {
                console.error(error);
                setMergedData([]);
                // setData([]);
                // setStoreData([]);
            }
            setIsLoading(false);
        };

        fetchStoreOrders();

        // testing:
        // const myPromise = new Promise((resolve) => {
        //     setTimeout(() => {
        //         setIsLoading(false);
        //         setData([]);
        //     }, 2000);
        // });
    }, [userRole, userStoreId]);

    return (
        <main>
            <HeaderBar pageName={'Store'} />
            <section>
                <PagesNavBar />
            </section>
            {isLoading && !mergedData && (
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
            {!isLoading && mergedData && mergedData?.length > 0 && (
                <OrderTable
                    data={mergedData}
                    setData={setMergedData}
                    storeId={userStoreId}
                />
                // <>
                //     <div className='flex flex-wrap gap-x-2 gap-y-0'>
                //         {STORE_CATEGORIES.map((category) => (
                //             <div
                //                 key={category}
                //                 className='flex flex-col items-center'
                //             >
                //                 <Button
                //                     key={category}
                //                     variant={
                //                         activeCateg === category
                //                             ? 'myTheme'
                //                             : 'outline'
                //                     }
                //                     onClick={() => setActiveCateg(category)}
                //                 >
                //                     {category}
                //                 </Button>
                //                 <div>{renderRedDot(category)}</div>
                //             </div>
                //         ))}
                //     </div>
                //     <div className='mb-2 text-sm'>
                //         {categoryMessage[activeCateg]}
                //     </div>
                //     <div className='flex flex-col mr-2'>
                //         <div className='rounded-lg border'>
                //             <Table>
                //                 <TableHeader className='bg-gray-200'>
                //                     {table
                //                         .getHeaderGroups()
                //                         .map((headerGroup) => (
                //                             <TableRow key={headerGroup.id}>
                //                                 {headerGroup.headers.map(
                //                                     (header) => (
                //                                         <TableHead
                //                                             key={header.id}
                //                                             style={{
                //                                                 width:
                //                                                     header.id ===
                //                                                     'order'
                //                                                         ? '130px'
                //                                                         : 'auto',
                //                                             }}
                //                                         >
                //                                             {flexRender(
                //                                                 header.column
                //                                                     .columnDef
                //                                                     .header,
                //                                                 header.getContext()
                //                                             )}
                //                                         </TableHead>
                //                                     )
                //                                 )}
                //                             </TableRow>
                //                         ))}
                //                 </TableHeader>
                //                 <TableBody>
                //                     {table.getRowModel().rows.map((row) => (
                //                         <TableRow key={row.id}>
                //                             {row
                //                                 .getVisibleCells()
                //                                 .map((cell) => (
                //                                     <TableCell
                //                                         key={cell.id}
                //                                         style={{
                //                                             width:
                //                                                 cell.column
                //                                                     .id ===
                //                                                 'order'
                //                                                     ? '130px'
                //                                                     : 'auto',
                //                                         }}
                //                                     >
                //                                         {flexRender(
                //                                             cell.column
                //                                                 .columnDef.cell,
                //                                             cell.getContext()
                //                                         )}
                //                                     </TableCell>
                //                                 ))}
                //                         </TableRow>
                //                     ))}
                //                 </TableBody>
                //             </Table>
                //         </div>
                //         <div>
                //             {' '}
                //             {/* Pagination: 10 items per page */}
                //             <div className='flex items-center justify-end space-x-2 py-4'>
                //                 <Button
                //                     variant='outline'
                //                     size='sm'
                //                     onClick={() => table.previousPage()}
                //                     disabled={!table.getCanPreviousPage()}
                //                 >
                //                     Previous
                //                 </Button>
                //                 <Button
                //                     variant='outline'
                //                     size='sm'
                //                     onClick={() => table.nextPage()}
                //                     disabled={!table.getCanNextPage()}
                //                 >
                //                     Next
                //                 </Button>
                //             </div>
                //         </div>
                //     </div>
                // </>
            )}
            {!isLoading && mergedData && mergedData?.length <= 0 && (
                // <div className='flex flex-col justify-center'>
                <section className='flex justify-center'>
                    <NoStoreOrdersDue />
                </section>
                // </div>
            )}
        </main>
    );
}
