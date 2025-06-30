'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
    PaginationState,
} from '@tanstack/react-table';
import { Check, ClipboardCopy, Dot, Send } from 'lucide-react';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    setRefreshParentTrigger,
}: {
    data: OrderItem[];
    setData: React.Dispatch<React.SetStateAction<OrderItem[] | undefined>>;
    storeId: number | undefined;
    setRefreshParentTrigger: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [activeCateg, setActiveCateg] = useState<StoreCategory>(
        STORE_CATEGORIES[1]
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // const [filteredData, setFilteredData] = useState<OrderItem[]>(data);
    const { toast } = useToast();
    const [toggleAutoFill, setToggleAutoFill] = useState<boolean>(false);
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );
    const filteredData = useMemo(() => {
        return data.filter((item) => item.store_categ === activeCateg);
    }, [data, activeCateg]);

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
                autoComplete='off'
                onChange={(e) => setValue(e.target.value)}
                // onFocus and onClick allows consistent selection of all text in input field
                onFocus={(e) => {
                    setTimeout(() => {
                        e.target.select();
                    }, 0);
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
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
            header: 'Size',
        },
        {
            accessorKey: 'pars_value',
            header: `${
                activeCateg === 'PASTRY'
                    ? new Date(
                          new Date().setDate(new Date().getDate() + 1)
                      ).toLocaleDateString('en-US', { weekday: 'long' }) +
                      ' PAR'
                    : 'PAR'
            }`,
            cell: (info) => {
                return (
                    <p>{`${Number(
                        Number(info.row.original.pars_value).toFixed(2)
                    )}`}</p>
                );
            },
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
        onPaginationChange: setPagination,
        state: {
            pagination,
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
            // pastries go to bakery_orders and store_bakery_orders tables
            const bakeryOrders = filteredData.filter(
                (order) => order.cron_categ === 'PASTRY'
            );

            if (bakeryOrders.length === 0) {
                toast({
                    title: 'No Orders to Submit',
                    description: `No orders to submit for ${activeCateg} category`,
                    variant: 'destructive',
                });
            } else {
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
                        description: `${activeCateg} orders have been sent successfully`,
                        className: 'bg-myBrown border-none text-myDarkbrown',
                    });
                } catch (error) {
                    const err = error as Error;
                    let msg = err.message;
                    if (msg.length >= 100) {
                        msg = msg.slice(0, 100) + '...';
                    }
                    toast({
                        title: 'Error',
                        description: msg,
                        variant: 'destructive',
                    });
                }
            }
        } else {
            // ...And every other item category (cron_categ) goes to orders table as an external vendor order
            // let externalOrders = filteredData.filter(
            //     (order) => order.cron_categ !== 'PASTRY'
            // );
            let externalOrders = filteredData.filter(
                (order) => order.store_categ === activeCateg
            );

            if (externalOrders.length === 0) {
                toast({
                    title: 'No Orders to Submit',
                    description: `No orders to submit for ${activeCateg} category`,
                    variant: 'destructive',
                });
            } else {
                try {
                    const response = await fetch(
                        `/api/v1/store-orders?storeId=${storeId}&vendor=external`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(externalOrders),
                        }
                    );
                    const responseData = await response.json();

                    if (!response.ok) {
                        throw new Error(responseData.error);
                    }

                    toast({
                        title: 'Store Orders Sent',
                        description: `${activeCateg} orders have been sent successfully`,
                        className: 'bg-myBrown border-none text-myDarkbrown',
                    });
                } catch (error) {
                    const err = error as Error;
                    let msg = err.message;
                    if (msg.length >= 100) {
                        msg = msg.slice(0, 100) + '...';
                    }
                    toast({
                        title: 'Error',
                        description: msg,
                        variant: 'destructive',
                    });
                }
            }
        }

        setIsSubmitting(false);
        setRefreshParentTrigger((prev) => prev + 1); // refresh page
    };

    // useEffect(() => {
    //     if (activeCateg !== 'ALL') {
    //         setFilteredData(
    //             data.filter((item) => item.store_categ === activeCateg)
    //         );
    //     }
    // }, [data, activeCateg]);

    return (
        <div className='mt-2'>
            <div className='flex flex-col mr-2'>
                <div>
                    <div className='flex flex-wrap gap-x-2 gap-y-0 border-x border-t rounded-t-2xl border-neutral-300 px-4 pt-4'>
                        {STORE_CATEGORIES.map(
                            (category) =>
                                category !== 'NONE' &&
                                category !== 'ALL' && (
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
                                            onClick={() => {
                                                setPagination({
                                                    ...pagination,
                                                    pageIndex: 0,
                                                });
                                                setToggleAutoFill(false);
                                                setActiveCateg(category);
                                            }}
                                        >
                                            {category}
                                        </Button>
                                        <div>{renderDot(category)}</div>
                                    </div>
                                )
                        )}
                    </div>
                    <div>
                        <div className='flex justify-end border-x border-neutral-300 px-4'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='myTheme2'
                                            style={{
                                                width: '130px',
                                                height: '30px',
                                                fontSize: 12,
                                            }}
                                            onClick={() =>
                                                autoFillOrders(
                                                    data,
                                                    activeCateg,
                                                    setData,
                                                    toggleAutoFill,
                                                    setToggleAutoFill
                                                )
                                            }
                                            disabled={
                                                filteredData.length === 0 ||
                                                isSubmitting ||
                                                activeCateg === 'ALL'
                                            }
                                        >
                                            Autofill Orders
                                            <ClipboardCopy size={8} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Fill orders with PAR levels</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <form>
                            <div className='border-x border-b rounded-b-2xl border-neutral-300 px-4 pb-4'>
                                <Table>
                                    <TableHeader>
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <TableHead
                                                                key={header.id}
                                                                className={`text-neutral-500/60 font-semibold ${
                                                                    header.id ===
                                                                    'order'
                                                                        ? 'text-center'
                                                                        : ''
                                                                }`}
                                                                style={{
                                                                    width:
                                                                        header.id ===
                                                                        'order'
                                                                            ? '130px'
                                                                            : 'auto',
                                                                }}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
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
                                        {filteredData.length === 0 &&
                                            activeCateg !== 'ALL' && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={columns.length}
                                                        className='text-center text-neutral-500/60'
                                                    >
                                                        <div className='flex justify-center gap-1'>
                                                            {activeCateg} orders
                                                            completed
                                                            <Check className='w-4 h-4' />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        {(filteredData.length > 0 ||
                                            activeCateg === 'ALL') &&
                                            table
                                                .getRowModel()
                                                .rows.map((row) => (
                                                    <TableRow key={row.id}>
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => (
                                                                <TableCell
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    style={{
                                                                        width:
                                                                            cell
                                                                                .column
                                                                                .id ===
                                                                            'order'
                                                                                ? '130px'
                                                                                : 'auto',
                                                                    }}
                                                                    className='py-2'
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                    </TableRow>
                                                ))}
                                    </TableBody>
                                </Table>
                                <div className='flex justify-between'>
                                    <div className='flex items-center space-x-2'>
                                        <p className='text-sm text-muted-foreground'>
                                            Rows per page
                                        </p>
                                        <Select
                                            value={`${pageSize}`}
                                            onValueChange={(value) => {
                                                table.setPageSize(
                                                    Number(value)
                                                );
                                            }}
                                        >
                                            <SelectTrigger className='h-8 w-[70px]'>
                                                <SelectValue
                                                    placeholder={pageSize}
                                                />
                                            </SelectTrigger>
                                            {table.getPageCount() > 0 ? (
                                                <SelectContent side='top'>
                                                    {[5, 10, 20, 200].map(
                                                        (size) => (
                                                            <SelectItem
                                                                key={size}
                                                                value={`${size}`}
                                                            >
                                                                {size === 200
                                                                    ? 'All'
                                                                    : size}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            ) : (
                                                <SelectContent side='top'>
                                                    <SelectItem
                                                        value={'0'}
                                                        disabled
                                                    />
                                                </SelectContent>
                                            )}
                                        </Select>
                                    </div>
                                    {/* Pagination: 10 items per page */}
                                    <div className='flex items-center space-x-2'>
                                        {table.getPageCount() > 0 && (
                                            <p className='text-sm text-neutral-500 mr-2'>
                                                Page {pageIndex + 1} /{' '}
                                                {table.getPageCount()}
                                            </p>
                                        )}
                                        <div className='flex items-center space-x-2 py-4'>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                size='sm'
                                                onClick={() =>
                                                    table.previousPage()
                                                }
                                                disabled={
                                                    !table.getCanPreviousPage()
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                size='sm'
                                                onClick={() => table.nextPage()}
                                                disabled={
                                                    !table.getCanNextPage()
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end mt-2'>
                                {activeCateg !== 'ALL' &&
                                    filteredData.length > 0 && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant='myTheme5'
                                                    disabled={isSubmitting}
                                                >
                                                    Submit
                                                    <Send />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {`Complete All ${activeCateg} Orders?`}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {`Press Submit only if all ${activeCateg.toLowerCase()} orders
                                                    are completed. Otherwise press Cancel.`}
                                                    </AlertDialogDescription>
                                                    {!storeId && (
                                                        <AlertDialogDescription className='text-red-500 text-xs'>
                                                            Note: Only Store
                                                            Managers can submit
                                                            orders at this time.
                                                        </AlertDialogDescription>
                                                    )}
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
                                                            disabled={
                                                                isSubmitting ||
                                                                !storeId
                                                            }
                                                        >
                                                            {isSubmitting
                                                                ? 'Submitting...'
                                                                : 'Submit'}
                                                        </Button>
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function autoFillOrders(
    data: OrderItem[],
    activeCateg: StoreCategory,
    setData: React.Dispatch<React.SetStateAction<OrderItem[] | undefined>>,
    toggleAutoFill: boolean,
    setToggleAutoFill: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (!data.length) return;

    setData(
        data.map((order) => {
            if (order.store_categ === activeCateg) {
                order.order = toggleAutoFill
                    ? null
                    : Number(Number(order.pars_value).toFixed(2)) ?? 0;
            }
            return order;
        })
    );
    setToggleAutoFill(!toggleAutoFill);
}
