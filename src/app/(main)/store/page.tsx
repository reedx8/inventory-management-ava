'use client';
import StoreNavsBar from '@/components/stores-navbar';
import React, { useState } from 'react';
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
import { init } from 'next/dist/compiled/webpack/webpack';
// import next from 'next';

interface Item {
    id: number;
    name: string;
    dueDate: string;
    qty_per_order: string;
    order: number | null;
    location_categ: string;
    status: string;
}

const LOCATION_CATEGORIES = [
    'All',
    'Pastry',
    'Front',
    'General',
    'Fridge',
    'Stockroom',
    'Beans & Tea',
] as const;

// Sample data
const initialData: Item[] = [
    {
        id: 1,
        name: 'Tomatoes',
        dueDate: '2025-02-01',
        qty_per_order: '1 lb.',
        order: null,
        location_categ: 'Fridge',
        status: 'DUE',
    },
    {
        id: 2,
        name: 'Grapes',
        dueDate: '2025-02-15',
        qty_per_order: '1 lb.',
        order: null,
        location_categ: 'Fridge',
        status: 'DUE',
    },
    {
        id: 3,
        name: 'Paper Cup Lids',
        dueDate: '2025-03-01',
        qty_per_order: '50 each',
        order: null,
        location_categ: 'General',
        status: 'DUE',
    },
    {
        id: 4,
        name: 'Napkins',
        dueDate: '2025-03-15',
        qty_per_order: '12/500 CT',
        order: null,
        location_categ: 'General',
        status: 'DUE',
    },
    {
        id: 5,
        name: 'Straws',
        dueDate: '2025-04-01',
        qty_per_order: '500/box',
        order: null,
        location_categ: 'General',
        status: 'DUE',
    },
    {
        id: 6,
        name: 'Blackberry Flavor',
        dueDate: '2025-04-15',
        qty_per_order: '1 bottle',
        order: null,
        location_categ: 'Stockroom',
        status: 'DUE',
    },
    {
        id: 7,
        name: 'Life Water',
        dueDate: '2025-05-01',
        qty_per_order: '1 case',
        order: null,
        location_categ: 'Stockroom',
        status: 'DUE',
    },
    {
        id: 8,
        name: 'Cucumbers',
        dueDate: '2025-05-15',
        qty_per_order: 'Bag of 3',
        order: null,
        location_categ: 'Fridge',
        status: 'DUE',
    },
    {
        id: 9,
        name: 'Garlic',
        dueDate: '2025-06-01',
        qty_per_order: '3 lb.',
        order: null,
        location_categ: 'Fridge',
        status: 'DUE',
    },
    {
        id: 10,
        name: 'Mozarella',
        dueDate: '2025-06-15',
        qty_per_order: '1 lb.',
        order: null,
        location_categ: 'Fridge',
        status: 'DUE',
    },
    {
        id: 11,
        name: 'Eggs',
        dueDate: '2025-07-01',
        qty_per_order: '15 Dozen',
        order: null,
        location_categ: 'General',
        status: 'DUE',
    },
    {
        id: 12,
        name: 'Decaf Beans',
        dueDate: '2025-07-01',
        qty_per_order: '1 bag',
        order: null,
        location_categ: 'Beans & Tea',
        status: 'SUBMITTED',
    },
    {
        id: 13,
        name: 'Strawberry & Cream Cheese Turnover',
        dueDate: '2025-07-01',
        qty_per_order: '?',
        order: null,
        location_categ: 'Pastry',
        status: 'DUE',
    },
    {
        id: 14,
        name: 'Sesame Bagel',
        dueDate: '2025-07-01',
        qty_per_order: 'Bag of 4',
        order: null,
        location_categ: 'Pastry',
        status: 'DUE',
    },
];

export default function Stores() {
    const [data, setData] = useState<Item[]>(initialData);
    const [activeCateg, setActiveCateg] = useState<string>('Pastry');

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
            accessorKey: 'dueDate',
            header: 'Due Date',
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: activeCateg === 'All' ? undefined : activeCateg,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            return row.original.location_categ === filterValue;
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
        All: '',
        Pastry: <p>Pastry item orders due everyday</p>,
        Front: <p>Front counter items</p>,
        General: <p>General items</p>,
        Stockroom: <p>Items in stockroom and its shelves</p>,
        Fridge: <p>Items in all fridges and freezers</p>,
        'Beans & Tea': <p>Coffee bean and tea items</p>,
    };

    // render red dot if any item is due in the category
    function renderRedDot(category: string) {
        const items = initialData.filter(
            (item) => item.location_categ === category
        );

        if (items.length > 0) {
            // Check if any item has status 'DUE'
            const hasDueItems = items.some((item) => item.status === 'DUE');
            if (hasDueItems) {
                return (
                    // <p>test</p>
                    // <div className='bg-red-500 rounded-full w-2 h-2 absolute top-0 right-0'></div>
                    <Dot className='text-red-500' />
                );
            }
        }
        return <div></div>;
    }

    return (
        <div className='ml-2 mt-6'>
            <div>
                <h1 className='text-3xl'>Store</h1>
            </div>
            <div>
                <StoreNavsBar />
            </div>
            <div className='mb-4 flex flex-wrap gap-2'>
                {LOCATION_CATEGORIES.map((category) => (
                    <div key={category} className='flex flex-col items-center'>
                        {/* {renderRedDot(category)} */}
                        <Button
                            key={category}
                            variant={
                                activeCateg === category ? 'myTheme' : 'outline'
                            }
                            onClick={() => setActiveCateg(category)}
                            // className='min-w-[100px]'
                        >
                            {category}
                        </Button>
                        <div>{renderRedDot(category)}</div>
                    </div>
                ))}
            </div>
            <div className='mb-2 text-sm'>{categoryMessage[activeCateg]}</div>
            <div className='flex flex-col mr-2'>
                <div className='rounded-lg border'>
                    <Table>
                        <TableHeader className='bg-gray-200'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width:
                                                    header.id === 'order'
                                                        ? '130px'
                                                        : 'auto',
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width:
                                                    cell.column.id === 'order'
                                                        ? '130px'
                                                        : 'auto',
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
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
        </div>
    );
}
