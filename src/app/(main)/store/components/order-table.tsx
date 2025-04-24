'use client';
import React, { useEffect, useState } from 'react';
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
    CellContext,
} from '@tanstack/react-table';
import { Dot, Send } from 'lucide-react';
import {
    OrderItem,
    StoreCategory,
    STORE_CATEGORIES,
} from '@/app/(main)/store/types';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TableMeta<TData> {
    updateData: (
        rowIndex: number,
        columnId: string,
        value: number | null
    ) => void;
}

export default function OrderTable({
    data,
    setData,
    storeId,
    setRefreshTrigger,
}: {
    data: OrderItem[];
    setData: React.Dispatch<React.SetStateAction<OrderItem[] | undefined>>;
    storeId: number | undefined;
    setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [activeCateg, setActiveCateg] = useState<StoreCategory>(
        STORE_CATEGORIES[1]
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<OrderItem[]>(data);
    const { toast } = useToast();

    // Accepts integers only
    const OrderCell = ({
        getValue,
        row,
        column,
        table,
    }: CellContext<OrderItem, number | null>) => {
        const initialValue = getValue();
        const [value, setValue] = useState<string>(
            initialValue?.toString() ?? ''
        );
        // const inputRef = useRef<HTMLInputElement>(null);

        const handleBlur = () => {
            const numValue = value === '' ? null : parseFloat(value);
            (table.options.meta as TableMeta<OrderItem>).updateData(
                row.index,
                column.id,
                numValue
            );

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
                (table.options.meta as TableMeta<OrderItem>).updateData(
                    row.index,
                    column.id,
                    numValue
                );

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
                onWheel={(e) => e.currentTarget.blur()}
                data-row-index={row.index}
                data-column-id={column.id}
                className='h-6 text-center'
                min='0'
                step='0.5'
                // placeholder={value}
                placeholder='0'
                disabled={activeCateg === 'ALL' || isSubmitting}
                // name='order'
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
            accessorKey: 'pars_value',
            header: `${new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { weekday: 'long' })} Pars`,
        },
        {
            accessorKey: 'order',
            header: 'Order',
            // size: 200,
            cell: (props: CellContext<OrderItem, unknown>) =>
                OrderCell(props as CellContext<OrderItem, number | null>),
            // cell: OrderCell,
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
        autoResetPageIndex: false, // prevents table resetting/refreshing back to pg 1 when user navigates away from an input field
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
        } as TableMeta<OrderItem>,
    });

    // render dot under category btn if any item is due in the category
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

    const handleSubmit = async () => {
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // TODO: clean data before submitting, refresh page, refactor to not use cron_categ, etc

        // e.preventDefault();
        if (!storeId) {
            // This is because storeId is needed for submission
            console.log('Admin view work in-progress');
            return; // TODO: admin view
        }

        setIsSubmitting(true);

        if (activeCateg === 'ALL') {
            console.log('ALL type submission disabled for now');
            setIsSubmitting(false);
            return;
        } else if (activeCateg === 'PASTRY') {
            const bakeryOrders = filteredData.filter(
                (order) => order.cron_categ === 'PASTRY'
            );
            // console.log('bakeryOrders: ', bakeryOrders);
            try {
                const response = await fetch(
                    `/api/v1/store-orders?storeId=${storeId}&vendor=bakery`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bakeryOrders),
                    }
                );
                const res = await response.json();

                if (!response.ok) {
                    const msg = res.message;
                    throw new Error(msg);
                }

                toast({
                    title: 'Store Orders Sent',
                    description: 'Your orders have been sent successfully',
                    className: 'bg-myBrown border-none text-myDarkbrown',
                });
            } catch (error) {
                const err = error as Error;
                toast({
                    title: 'Error',
                    description: err.message,
                    variant: 'destructive',
                });
            }
        } else {
            const externalOrders = filteredData.filter(
                (order) => order.cron_categ !== 'PASTRY'
            );

            try {
                const response = await fetch(
                    `/api/v1/store-orders?storeId=${storeId}&vendor=external`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(externalOrders),
                        // body: JSON.stringify(progressOrders),
                    }
                );
                const res = await response.json();

                if (!response.ok) {
                    const msg = res.message;
                    // const id = res.updates.id.toString();
                    // const msg = `Failed sending store's orders`;
                    throw new Error(msg);
                }
                // console.log('data sent: ', result);
                toast({
                    title: 'Store Orders Sent',
                    description: 'Your orders have been sent successfully',
                    className: 'bg-myBrown border-none text-myDarkbrown',
                });
            } catch (error) {
                const err = error as Error;
                toast({
                    title: 'Error',
                    description: err.message,
                    variant: 'destructive',
                });
            }
        }
        setIsSubmitting(false);
        setRefreshTrigger((prev) => prev + 1);
        // refreshPage();
    };

    useEffect(() => {
        if (activeCateg !== 'ALL') {
            setFilteredData(
                data.filter((item) => item.store_categ === activeCateg)
            );
        }
    }, [data, activeCateg]);

    // function getStoreCategOrders() {
    //     if (activeCateg === STORE_CATEGORIES[0]){ // ALL
    //         console.log("all data")
    //         return data;
    //     } else {
    //         console.log("filtered data")
    //         return data.filter((item) => item.store_categ === activeCateg);
    //     }
    // }
    // console.log(getStoreCategOrders);

    return (
        <div>
            {/* <div className='mb-2 text-sm'>{categoryMessage[activeCateg]}</div> */}
            <div className='flex flex-col mr-2'>
                <div className='rounded-2xl border border-neutral-300 p-6'>
                    <div className='flex flex-wrap gap-x-2 gap-y-0 '>
                        {STORE_CATEGORIES.map(
                            (category) =>
                                category !== 'NONE' && (
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
                                            onClick={() =>
                                                setActiveCateg(category)
                                            }
                                        >
                                            {category}
                                        </Button>
                                        <div>{renderDot(category)}</div>
                                    </div>
                                )
                        )}
                    </div>
                    <form>
                    {/* <form onSubmit={handleSubmit}> */}
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
                                                    header.column.columnDef
                                                        .header,
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
                                                        cell.column.id ===
                                                        'order'
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
                        <div className='flex justify-end gap-2'>
                            {/* TODO */}
                            {/* <Button variant='outline' className='border-myDarkbrown text-myDarkbrown hover:text-myDarkbrown'>Pars Fill <CopyPlus /></Button> */}
                            {activeCateg !== 'ALL' &&
                                filteredData.length > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant='myTheme5'>
                                                Submit
                                                <Send/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {`Complete All ${activeCateg[0] + activeCateg.slice(1).toLowerCase()} Orders?`}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {`Press Submit only if all ${activeCateg.toLowerCase()} orders
                                                    are completed.`}
                                                </AlertDialogDescription>
                                                <AlertDialogDescription>
                                                    Otherwise, Press Cancel.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button
                                                        variant='myTheme'
                                                        onClick={
                                                            handleSubmit
                                                        }
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                                        {/* Submit */}
                                                    </Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    // <Button
                                    //     type='submit'
                                    //     variant='myTheme5'
                                    //     disabled={isSubmitting}
                                    // >
                                    //     Submit <Send />
                                    // </Button>
                                )}
                        </div>
                    </form>
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
