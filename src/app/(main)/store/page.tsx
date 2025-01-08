'use client';
import StoreNavsBar from '@/components/stores-navbar';
import React, { useRef, useState } from 'react';
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
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import next from 'next';

// Sample data
const initialData = [
    {
        id: 1,
        name: 'Tomatoes',
        dueDate: '2025-02-01',
        size: '1 lb.',
        order: null,
    },
    {
        id: 2,
        name: 'Grapes',
        dueDate: '2025-02-15',
        size: '1 lb.',
        order: null,
    },
    {
        id: 3,
        name: 'Paper Cup Lids',
        dueDate: '2025-03-01',
        size: '50 each',
        order: null,
    },
    {
        id: 4,
        name: 'Napkins',
        dueDate: '2025-03-15',
        size: '12/500 CT',
        order: null,
    },
    {
        id: 5,
        name: 'Straws',
        dueDate: '2025-04-01',
        size: '500/box',
        order: null,
    },
    {
        id: 6,
        name: 'Blackberry Flavor',
        dueDate: '2025-04-15',
        size: '1 bottle',
        order: null,
    },
    {
        id: 7,
        name: 'Life Water',
        dueDate: '2025-05-01',
        size: '1 case',
        order: null,
    },
    {
        id: 8,
        name: 'Cucumbers',
        dueDate: '2025-05-15',
        size: 'Bag of 3',
        order: null,
    },
    {
        id: 9,
        name: 'Garlic',
        dueDate: '2025-06-01',
        size: '3 lb.',
        order: null,
    },
    {
        id: 10,
        name: 'Mozarella',
        dueDate: '2025-06-15',
        size: '1 lb.',
        order: null,
    },
    {
        id: 11,
        name: 'Eggs',
        dueDate: '2025-07-01',
        size: '15 Dozen',
        order: null,
    },
];

export default function Stores() {
    const [data, setData] = useState(initialData);

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
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date',
        },
        {
            accessorKey: 'size',
            header: 'Size/Order',
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
        // defaultColumn: {
        //     size: 500,
        //     minSize: 500,
        //     maxSize: 700,
        // },
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

    return (
        <div className='ml-2 mt-6'>
            <div>
                <h1 className='text-3xl'>Store</h1>
            </div>
            <div>
                <StoreNavsBar />
            </div>
            <div className='flex flex-col mr-2'>
                <div className='rounded-lg border'>
                    <Table>
                        <TableHeader className='bg-gray-100'>
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
