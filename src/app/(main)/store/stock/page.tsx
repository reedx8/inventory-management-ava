'use client';
import StoreNavsBar from '@/components/pages-navbar';
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
import { Dot } from 'lucide-react';
import noStockPic from '/public/illustrations/empty.svg';
import Image from 'next/image';
import { TodaysDate } from '@/components/todays-date';

interface Item {
    id: number;
    name: string;
    due_date: string;
    units: string;
    stock_qty: number | null;
    store_categ: string;
    stage: string;
}

const STORE_CATEGORIES = [
    'ALL',
    'PASTRY',
    'FRONT',
    'GENERAL',
    'FRIDGE',
    'STOCKROOM',
    'BEANS&TEA',
] as const;

const dummyData : Item[] = [
    {
        id: 1,
        name: 'Tomatoes',
        due_date: '2025-06-15',
        units: '1 Pc',
        stock_qty: 0,
        store_categ: 'FRIDGE',
        stage: 'DUE',
    },
    {
        id: 2,
        name: 'Semi Sweet Dark Chocolate',
        due_date: '2025-06-15',
        units: '22 lb',
        stock_qty: 0,
        store_categ: 'BEANS&TEA',
        stage: 'DUE',
    },
    {
        id: 3,
        name: 'AVA Drip Blend',
        due_date: '2025-06-15',
        units: 'Bucket (16 lb)',
        stock_qty: 0,
        store_categ: 'BEANS&TEA',
        stage: 'DUE',
    },
    {
        id: 4,
        name: 'Black Ice Tea',
        due_date: '2025-06-15',
        units: '50 Pcs/Pack',
        stock_qty: 0,
        store_categ: 'BEANS&TEA',
        stage: 'DUE',
    },
];

export default function Stock() {
    const [data, setData] = useState<Item[]>([]);
    const [activeCateg, setActiveCateg] = useState<string>('PASTRY');

    // Accepts integers only
    const StockCell = ({ getValue, row, column, table }) => {
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
            accessorKey: 'due_date',
            header: 'Due Date',
        },
        {
            accessorKey: 'units',
            header: 'Units',
        },
        {
            accessorKey: 'stock_qty',
            header: 'Stock Quantity',
            // size: 200,
            cell: StockCell,
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: activeCateg === 'ALL' ? undefined : activeCateg,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            return row.original.store_categ === filterValue;
        },
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
        },
    });

    // object lookup for category messages
    const categoryMessage: Record<string, JSX.Element | string> = {
        ALL: '',
        PASTRY: <p>Pastry stock due every Sunday</p>,
        FRONT: <p>Front counter items</p>,
        GENERAL: <p>General items</p>,
        STOCKROOM: <p>Items in stockroom and its shelves</p>,
        FRIDGE: <p>Items in all fridges and freezers</p>,
        'BEANS&TEA': <p>Coffee bean and tea items</p>,
    };

    // render red dot if any item is due in the category
    function renderRedDot(category: string) {
        const items = data.filter((item) => item.store_categ === category);

        if (items.length > 0) {
            // Check if any item has stage 'DUE'
            const hasDueItems = items.some((item) => item.stage === 'DUE');
            if (hasDueItems) {
                return (
                    // <p>test</p>
                    // <div className='bg-red-500 rounded-full w-2 h-2 absolute top-0 right-0'></div>
                    <Dot className='text-red-500 w-8 h-8' />
                );
            }
        }
        return <div></div>;
    }

    useEffect(() => {
        const fetchStoresStock = async () => {
            try {
                // fetch every store (no storeId param in api url)
                const response = await fetch('/api/v1/store-stock?storeId=2');
                const data = await response.json();
                if (response.ok) {
                    setData(data); // set data to all stores
                    // setStoreData(data);
                } else {
                    console.error('Error fetching store stock:', data);
                    setData([]);
                    // setStoreData([]);
                }
            } catch (error) {
                console.error('Error fetching store stock:', error);
                setData([]);
                // setStoreData([]);
            }
        };

        // fetchStoresStock();
    }, []);

    return (
        <div className='mt-6'>
            <div>
                <h1 className='text-3xl'>Store <TodaysDate/></h1>
            </div>
            <div className="mb-6">
                <StoreNavsBar />
            </div>
            {data?.length > 0 ? (
                <>
                    <div className='flex flex-wrap gap-2'>
                        {STORE_CATEGORIES.map((category) => (
                            <div
                                key={category}
                                className='flex flex-col items-center'
                            >
                                <Button
                                    key={category}
                                    variant={
                                        activeCateg === category
                                            ? 'myTheme'
                                            : 'outline'
                                    }
                                    onClick={() => setActiveCateg(category)}
                                >
                                    {category}
                                </Button>
                                <div>{renderRedDot(category)}</div>
                            </div>
                        ))}
                    </div>
                    <div className='mb-2 text-sm'>
                        {categoryMessage[activeCateg]}
                    </div>
                    <div className='flex flex-col mr-2'>
                        <div className='rounded-lg border'>
                            <Table>
                                <TableHeader className='bg-gray-200'>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <TableHead
                                                            key={header.id}
                                                            style={{
                                                                width:
                                                                    header.id ===
                                                                    'stock_qty'
                                                                        ? '130px'
                                                                        : 'auto',
                                                            }}
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                        </TableHead>
                                                    )
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            width:
                                                                cell.column
                                                                    .id ===
                                                                'stock_qty'
                                                                    ? '130px'
                                                                    : 'auto',
                                                        }}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            {' '}
                            {/* Pagination: 10 items per page */}
                            <div className='flex items-center justify-end space-x-2 py-4'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // <div className='flex flex-col justify-center'>
                    <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                        <Image
                            src={noStockPic}
                            alt='no stock due today pic'
                            width={300}
                            height={300}
                        />
                        <p className="text-2xl text-gray-600">No Stock Due!</p>
                        <p className="text-sm text-gray-400">No stock entries due currently</p>
                        {/* <Button size='lg' variant='myTheme'>Create Stock Entry</Button> */}
                    </div>
                // </div>
            )}
        </div>
    );
}
