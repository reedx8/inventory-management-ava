'use client';
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
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Dot } from 'lucide-react';
import {
    OrderItem,
    StoreCategory,
    STORE_CATEGORIES,
} from '@/app/(main)/store/types';
import { Or } from 'drizzle-orm';

// object lookup for category messages
// const categoryMessage: Record<StoreCategory, JSX.Element | string> = {
//     ALL: '',
//     PASTRY: <p>Pastry item orders due everyday</p>,
//     FRONT: <p>Front counter items</p>,
//     GENERAL: <p>General items</p>,
//     STOCKROOM: <p>Items in stockroom and its shelves</p>,
//     FRIDGE: <p>Items in all fridges and freezers</p>,
//     'BEANS&TEA': <p>Coffee bean and tea items</p>,
// };

export default function OrderTable({
    data,
    setData,
}: {
    data: OrderItem[];
    setData: React.Dispatch<React.SetStateAction<OrderItem[] | undefined>>;
}) {
    const [activeCateg, setActiveCateg] = useState<StoreCategory>(
        STORE_CATEGORIES[1]
    );

    // if (!data) {
    //     return <div></div>;
    // }

    // Accepts integers only
    const OrderCell = ({ getValue, row, column, table }) => {
        const initialValue = getValue();
        const [value, setValue] = useState<string>(
            initialValue?.toString() ?? ''
        );
        // const inputRef = useRef<HTMLInputElement>(null);

        const handleBlur = () => {
            const numValue = value === '' ? null : parseFloat(value);
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
                const numValue = value === '' ? null : parseFloat(value);
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
                // onChange={(e) =>
                //     e.target.value.includes('.')
                //         ? setValue('')
                //         : setValue(e.target.value)
                // }
                onChange={(e) => setValue(e.target.value)}
                // onKeyDown=""
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                data-row-index={row.index}
                data-column-id={column.id}
                className='h-6 text-center'
                min='0'
                step="0.5"
                placeholder='0'
            />
        );
    };

    const columns: ColumnDef<OrderItem>[] = [
        {
            accessorKey: 'name', // accessorKey matches to the property name in initialData[], thereby rendering the appropriate data
            header: 'Name',
            cell: (info) => {
                return (
                    <>
                        <p>{`${info.row.original.name}`}</p>
                        <p className='text-neutral-500/70 text-xs'>{` ${
                            info.row.original.store_name ?? ''
                        }`}</p>
                    </>
                );
            },
        },
        // {
        //     accessorKey: 'store_name',
        //     header: 'Store',
        // },
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
            globalFilter: activeCateg === 'ALL' ? undefined : activeCateg,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            return row.original.store_categ === filterValue;
        },
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setData((old) =>
                    old?.map((row, index) => {
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

    // render red dot if any item is due in the category
    function renderDot(category: string) {
        const items = data.filter((item) => item.store_categ === category);

        if (items.length > 0) {
            return <Dot className='text-myDarkbrown w-8 h-8' />;
            /*
            // Check if any item has stage 'DUE'
            const hasDueItems = items.some((item) => item.stage === 'DUE');
            if (hasDueItems) {
                return (
                    <Dot className='text-red-500 w-8 h-8' />
                );
            }
            */
        } else if (category === 'ALL' && data.length > 0) {
            return <Dot className='text-myDarkbrown w-8 h-8' />;
        }
        return <div></div>;
    }

    return (
        <div>
            {/* <div className='flex flex-wrap gap-x-2 gap-y-0'>
                {STORE_CATEGORIES.map((category) => (
                    <div key={category} className='flex flex-col items-center'>
                        <Button
                            key={category}
                            variant={
                                activeCateg === category ? 'myTheme' : 'outline'
                            }
                            onClick={() => setActiveCateg(category)}
                        >
                            {category}
                        </Button>
                        <div>{renderDot(category)}</div>
                    </div>
                ))}
            </div> */}
            {/* <div className='mb-2 text-sm'>{categoryMessage[activeCateg]}</div> */}
            <div className='flex flex-col mr-2'>
                <div className='rounded-2xl border border-neutral-300 p-6'>
                    <div className='flex flex-wrap gap-x-2 gap-y-0 '>
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
                                <div>{renderDot(category)}</div>
                            </div>
                        ))}
                    </div>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className='text-neutral-500/30 font-semibold'
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
