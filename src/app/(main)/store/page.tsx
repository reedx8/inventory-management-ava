'use client';
import PagesNavBar from '@/components/pages-navbar';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Dot } from 'lucide-react';
import noOrdersPic from '/public/illustrations/barista.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import { useAuth } from '@/contexts/auth-context';
import OrderTable from './components/order-table';
// import { getStoreOrders } from '@/db/queries/select';
// import { init } from 'next/dist/compiled/webpack/webpack';
// import next from 'next';

interface OrderItem {
    id: number;
    name: string;
    due_date: string;
    qty_per_order: string;
    order: number | null;
    store_categ: string;
    store_name: string;
}

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
    const [data, setData] = useState<OrderItem[] | undefined>();
    // const [data, setData] = useState<OrderItem[]>(dummyData);
    // const [ storeData, setStoreData ] = useState<OrderItem[]>([]);
    // const [activeCateg, setActiveCateg] = useState<string>('PASTRY');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Accepts integers only
    const OrderCell = ({ getValue, row, column, table }) => {
        const initialValue = getValue();
        const [value, setValue] = useState<string>(
            initialValue?.toString() ?? ''
        );
        // const inputRef = useRef<HTMLInputElement>(null);

        const handleBlur = () => {
            const numValue = value === '' ? null : parseInt(value);
            table.options.meta?.updateData(row.index, column.id, numValue);

            // table.options.meta?.updateData(row.index, column.id, value);
        };

        const focusNextInput = (currentRowIndex: number) => {
            const nextRowIndex = currentRowIndex + 1;

            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                try {
                    // Try to find next input directly by row index
                    const nextInput = document.querySelector(
                        `input[data-row-index="${nextRowIndex}"][data-column-id="${column.id}"]`
                    ) as HTMLInputElement;

                    if (nextInput) {
                        nextInput.focus();
                        nextInput.select(); // Optional: select the text
                    } else {
                        console.log('No next input found');
                    }
                } catch (error) {
                    console.error('Focus error:', error);
                }
            }, 10);
        };

        const handleKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                event.stopPropagation();

                // Save the current value
                const numValue = value === '' ? null : parseInt(value);
                table.options.meta?.updateData(row.index, column.id, numValue);

                // Focus next input
                focusNextInput(row.index);
            }
        };

        return (
            <Input
                type='number'
                // ref={inputRef}
                // value={value}
                // value={value ?? ''}
                value={value !== null ? value : ''}
                onChange={(e) =>
                    e.target.value.includes('.')
                        ? setValue('')
                        : setValue(e.target.value)
                }
                // onKeyDown=""
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                data-row-index={row.index}
                data-column-id={column.id}
                className='h-6 text-center'
                min='0'
                // step="0.5"
                placeholder='0'
            />
        );
    };

    const columns = [
        {
            accessorKey: 'name', // accessorKey matches to the property name in initialData[], thereby rendering the appropriate data
            header: 'Name',
        },
        {
            accessorKey: 'store_name',
            header: 'Store',
        },
        {
            accessorKey: 'qty_per_order',
            header: 'Qty/Order',
        },
        {
            accessorKey: 'order',
            header: 'Order',
            // size: 200,
            cell: OrderCell,
        },
    ];

    // const table = useReactTable({
    //     data,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     state: {
    //         globalFilter: activeCateg === 'ALL' ? undefined : activeCateg,
    //     },
    //     globalFilterFn: (row, columnId, filterValue) => {
    //         return row.original.store_categ === filterValue;
    //     },
    //     meta: {
    //         updateData: (rowIndex, columnId, value) => {
    //             setData((old) =>
    //                 old.map((row, index) => {
    //                     if (index === rowIndex) {
    //                         return {
    //                             ...old[rowIndex],
    //                             [columnId]: value,
    //                         };
    //                     }
    //                     return row;
    //                 })
    //             );
    //         },
    //     },
    // });

    // object lookup for category messages
    const categoryMessage: Record<string, JSX.Element | string> = {
        ALL: '',
        PASTRY: <p>Pastry item orders due everyday</p>,
        FRONT: <p>Front counter items</p>,
        GENERAL: <p>General items</p>,
        STOCKROOM: <p>Items in stockroom and its shelves</p>,
        FRIDGE: <p>Items in all fridges and freezers</p>,
        'BEANS&TEA': <p>Coffee bean and tea items</p>,
    };

    // render red dot if any item is due in the category
    // function renderRedDot(category: string) {
    //     const items = data.filter((item) => item.store_categ === category);

    //     if (items.length > 0) {
    //         return <Dot className='text-red-500 w-8 h-8' />;
    //         /*
    //         // Check if any item has stage 'DUE'
    //         const hasDueItems = items.some((item) => item.stage === 'DUE');
    //         if (hasDueItems) {
    //             return (
    //                 <Dot className='text-red-500 w-8 h-8' />
    //             );
    //         }
    //         */
    //     } else if (category === 'ALL' && data.length > 0) {
    //         return <Dot className='text-red-500 w-8 h-8' />;
    //     }
    //     return <div></div>;
    // }

    useEffect(() => {
        const fetchStoreOrders = async () => {
            try {
                // fetch every store (no storeId param in api url)
                let response;
                if (userRole === 'admin') {
                    response = await fetch('/api/v1/store-orders');
                } else if (userRole === 'store_manager') {
                    response = await fetch(
                        `/api/v1/store-orders?storeId=${userStoreId}`
                    );
                } else {
                    // dont fetch orders for other roles
                    return;
                }
                const data = await response.json();
                if (response.ok) {
                    setData(data); // set data to all stores
                    // setStoreData(data);
                } else {
                    console.error('Error fetching store orders:', data);
                    setData([]);
                    // setStoreData([]);
                }
            } catch (error) {
                console.error('Error fetching store orders:', error);
                setData([]);
                // setStoreData([]);
            }
            setIsLoading(false);
        };

        // fetchStoreOrders();

        // testing:
        const myPromise = new Promise((resolve) => {
            setTimeout(() => {
                setIsLoading(false);
                setData([]);
            }, 2000);
        });

        // setData([]);
        // setIsLoading(false);
    }, [userRole, userStoreId]);

    return (
        <main>
            <HeaderBar pageName={'Store'} />
            <section>
                <PagesNavBar />
            </section>
            {isLoading && !data && (
                <section className='flex flex-col gap-3'>
                    <Skeleton className='h-12 w-[80%]' />
                    <Skeleton className='h-6 w-[80%]' />
                    <Skeleton className='h-6 w-[65%]' />
                    <Skeleton className='h-6 w-[50%]' />
                </section>
            )}
            {data && !isLoading && data?.length > 0 && (
                <OrderTable data={data} setData={setData} />
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
            {!isLoading && data && data?.length === 0 && (
                // <div className='flex flex-col justify-center'>
                <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noOrdersPic}
                        alt='no orders due today pic'
                        width={175}
                        height={175}
                        style={{ width: '175px', height: '175px' }}
                        className='drop-shadow-lg'
                    />
                    <p className='text-2xl text-gray-600'>No Orders Due!</p>
                    <p className='text-sm text-gray-400'>
                        All orders have been sent
                    </p>
                    {/* <p className='text-sm text-gray-400'>
                        Create an order below if needed
                    </p>
                    <Button size='lg' variant='myTheme'>
                        Create Order
                    </Button> */}
                </section>
                // </div>
            )}
        </main>
    );
}
