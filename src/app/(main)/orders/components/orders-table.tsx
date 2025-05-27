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
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
    CellContext,
} from '@tanstack/react-table';
import { Dot, Loader2, Pencil, Send } from 'lucide-react';
import { MilkBreadOrder } from '../types';
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { STORE_LOCATIONS } from '@/components/types';
import { useToast } from '@/hooks/use-toast';
// import { sendToGoogleSheet } from './send-to-gsheet';
// import { MILK_BREAD_VENDORS } from '@/components/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TableMeta<TData> {
    updateData: (
        rowIndex: number,
        columnId: string,
        value: number | null
    ) => void;
}

export default function OrdersTable({
    data,
    setData,
    storeId,
    setStoreId,
    setRefreshTrigger,
}: {
    data: MilkBreadOrder[];
    setData: React.Dispatch<React.SetStateAction<MilkBreadOrder[]>>;
    storeId: number;
    setStoreId: React.Dispatch<React.SetStateAction<number>>;
    setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [activeCateg, setActiveCateg] = useState<string>('MILK');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [storesData, setStoresData] = useState<MilkBreadOrder[]>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 6,
    });
    // const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { toast } = useToast();

    useEffect(() => {
        setStoresData(data.filter((item) => item.store_id === storeId));
    }, [data, storeId]);

    const InputCell = ({
        getValue,
        row,
        column,
        table,
    }: CellContext<MilkBreadOrder, number | null>) => {
        const initialValue = getValue();
        const [value, setValue] = useState<number>(initialValue ?? 0);

        // Update local state on change
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (
                e.target.value === '' ||
                typeof parseInt(e.target.value) !== 'number'
            ) {
                setValue(initialValue ?? 0);
            } else {
                setValue(Number(e.target.value));
            }
        };

        // Update table data on blur (or enter/tab?) as well
        const updateTableData = () => {
            (table.options.meta as TableMeta<MilkBreadOrder>).updateData(
                row.index,
                column.id,
                value
            );
        };

        return (
            <input
                type='number'
                // value={value}
                defaultValue={value}
                onChange={handleChange}
                className='h-8 text-center w-24'
                min={0}
                placeholder='0'
                step={0.5}
                disabled={isSubmitting}
                data-row-index={row.index}
                data-column-id={column.id}
                // onFocus and onClick allows consistent selection of all text in input field
                onFocus={(e) => {
                    setTimeout(() => {
                        e.target.select();
                    }, 0);
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                onWheel={(e) => e.currentTarget.blur()}
                onBlur={updateTableData}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                        updateTableData();
                    }
                }}
            />
        );
    };

    const columns: ColumnDef<MilkBreadOrder, number | null>[] = [
        {
            accessorKey: 'name', // accessorKey matches to the property name in initialData[], thereby rendering the appropriate data
            header: 'Name',
        },
        {
            accessorKey: 'cpu',
            header: 'Cost/Unit',
            cell: (row) => `$${Number(row.getValue() ?? 0).toFixed(2)}`,
        },
        {
            header: 'Total Cost',
            accessorFn: (row) => Number((row.cpu ?? 0) * (row.order_qty ?? 0)),
            cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        },
        {
            accessorKey: 'par',
            header: 'PAR',
            cell: (info) => (
                <p>{Number(Number(info.row.original.par ?? 0).toFixed(2))}</p>
            ),
        },
        {
            accessorKey: 'stock_count',
            header: 'Stock',
            cell: (info) => (
                <p>
                    {Number(
                        Number(info.row.original.stock_count ?? 0).toFixed(2)
                    )}
                </p>
            ),
        },
        {
            accessorKey: 'order_qty',
            header: 'Order',
            cell: InputCell,
            // cell: (props: CellContext<MilkBreadOrder, number | null>) =>
            //     InputCell(props),
        },
    ];

    const table = useReactTable<MilkBreadOrder>({
        data: storesData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        autoResetPageIndex: false, // prevents table resetting/refreshing back to pg 1 when user navigates away from an input field
        state: {
            globalFilter: activeCateg === 'ALL' ? undefined : activeCateg,
            pagination,
        },
        onPaginationChange: setPagination,
        globalFilterFn: (row, columnId, filterValue) => {
            return row.original.category === filterValue;
        },
        meta: {
            updateData: (
                rowIndex: number,
                columnId: string,
                value: number | null
            ) => {
                // Update original data, not storesData (FD should always be derived from original data to keep everything in sync)
                setData((old) =>
                    old?.map((row, index) => {
                        if (row.order_id === storesData[rowIndex].order_id) {
                            return {
                                ...row,
                                [columnId]: value,
                            };
                        }
                        // if (index === rowIndex) {
                        //     return {
                        //         ...old[rowIndex],
                        //         [columnId]: value,
                        //     };
                        // }
                        return row;
                    })
                );
            },
        } as TableMeta<MilkBreadOrder>,
    });

    // render dot if any item is due in the category
    function renderDot(itemCategory: string) {
        const items = storesData.filter(
            (item) => item.category === itemCategory.toUpperCase()
        );

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
        } else if (itemCategory === 'ALL' && storesData.length > 0) {
            return <Dot className='text-myDarkbrown w-8 h-8' />;
        }
        // else return nothing
        return <div></div>;
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Further filter storesData to only include items with the same category as current activeCateg selected
        const categStoresData = storesData.filter(
            (item) => item.category.toUpperCase() === activeCateg.toUpperCase()
        );
        // console.log('categStoresData: ', categStoresData);

        if (categStoresData.length === 0) {
            // toast.error('No items to submit');
            console.log('No items to submit');
            return;
        }

        setIsSubmitting(true);

        try {
            const [gsheetResponse, dbResponse] = await Promise.all([
                fetch('/api/v1/send-to-gsheet', {
                    method: 'POST',
                    body: JSON.stringify({
                        data: categStoresData,
                        activeCateg,
                        storeId,
                    }),
                }),
                fetch('/api/v1/milk-bread', {
                    method: 'PUT',
                    body: JSON.stringify(categStoresData),
                }),
            ]);

            if (!gsheetResponse.ok || !dbResponse.ok) {
                throw new Error(
                    'Failed to submit orders to Google Sheet and/or database'
                );
            }

            // const gsheetResponse = await fetch('/api/v1/send-to-gsheet', {
            //     method: 'POST',
            //     body: JSON.stringify({ data: categStoresData, activeCateg, storeId }),
            // });
            // const gsheetResponseData = await gsheetResponse.json();
            // if (!gsheetResponse.ok) {
            //     throw new Error(gsheetResponseData.error);
            // }

            // const response = await fetch('/api/v1/milk-bread', {
            //     method: 'PUT',
            //     body: JSON.stringify(categStoresData),
            // });
            // const responseData = await response.json();
            // if (!response.ok) {
            //     throw new Error(responseData.error);
            // }

            toast({
                title: 'Orders Submitted',
                description: 'Orders have been submitted successfully',
                className: 'bg-myBrown border-none text-myDarkbrown',
            });
        } catch (error) {
            // console.error('ERROR: ', error);
            let errMsg;
            if (String(error).length > 100) {
                errMsg = String(error).slice(0, 100) + '...';
            } else {
                errMsg = String(error);
            }
            toast({
                title: 'Error submitting orders',
                description: errMsg,
                variant: 'destructive',
            });
        }
        setIsSubmitting(false);
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className='mt-2'>
            <div className='flex flex-col mr-2'>
                <div className='flex justify-between border-t border-x rounded-t-2xl border-neutral-300 pt-4 px-4'>
                    <div className='flex flex-wrap gap-x-2 gap-y-0'>
                        {['Milk', 'Bread'].map((category) => (
                            <div
                                key={category}
                                className='flex flex-col items-center'
                            >
                                <Button
                                    key={category}
                                    variant={
                                        activeCateg === category.toUpperCase()
                                            ? 'myTheme'
                                            : 'outline'
                                    }
                                    onClick={() => {
                                        setActiveCateg(category.toUpperCase());
                                        // reset pagination to first page when category is changed
                                        setPagination({
                                            ...pagination,
                                            pageIndex: 0,
                                        });
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {category}
                                </Button>
                                <div>{renderDot(category.toUpperCase())}</div>
                            </div>
                        ))}
                    </div>
                    <Select
                        defaultValue={storeId.toString()}
                        onValueChange={(value) => {
                            setStoreId(parseInt(value));
                            // reset pagination to first page when store is changed
                            setPagination({
                                ...pagination,
                                pageIndex: 0,
                            });
                        }}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger className='w-fit'>
                            <SelectValue
                                placeholder={STORE_LOCATIONS[storeId - 1]}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* <SelectLabel>Fruits</SelectLabel> */}
                                {STORE_LOCATIONS.map((store, index) => (
                                    <SelectItem
                                        key={index + 1}
                                        value={(index + 1).toString()}
                                    >
                                        <div className='flex items-center'>
                                            {/* {store} */}
                                            {data.filter(
                                                (item) =>
                                                    item.store_id === index + 1
                                            ).length > 0 ? (
                                                <>
                                                    <p className=''>{store}</p>
                                                    <Dot className='text-myDarkbrown w-6 h-6' />
                                                </>
                                            ) : (
                                                <p className='text-neutral-400'>
                                                    {store}
                                                </p>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <form>
                    <div className='border-x border-b rounded-b-2xl border-neutral-300 px-4 pb-4'>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                style={{
                                                    textAlign:
                                                        header.id !== 'name'
                                                            ? 'center'
                                                            : 'left',
                                                }}
                                                className='text-neutral-500/30 font-semibold'
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
                                {table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className='text-center text-neutral-400'
                                        >
                                            {`Stock counts exist for other stores/categories. Please check other stores/categories.`}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            textAlign:
                                                                cell.column
                                                                    .id !==
                                                                'name'
                                                                    ? 'center'
                                                                    : 'left',
                                                        }}
                                                        className='text-black py-1 text-sm'
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div>
                            {table.getPageCount() > 1 && (
                                <div className='flex items-center justify-end space-x-2 mt-2'>
                                    <p className='text-xs text-neutral-400 mr-2'>
                                        Page {pagination.pageIndex + 1} /{' '}
                                        {table.getPageCount()}
                                    </p>
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
                            )}
                        </div>
                    </div>
                    <div className='flex justify-end mt-2'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant='myTheme5'
                                    disabled={
                                        isSubmitting || storesData.length === 0
                                    }
                                >
                                    Submit
                                    <Send />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {`Submit All ${
                                            activeCateg[0] +
                                            activeCateg.slice(1).toLowerCase()
                                        } Orders? (${
                                            STORE_LOCATIONS[storeId - 1]
                                        })`}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {`Press Submit only if all ${activeCateg.toLowerCase()} orders
                                                    for ${
                                                        STORE_LOCATIONS[
                                                            storeId - 1
                                                        ]
                                                    } are completed. Otherwise press Cancel.`}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            variant='myTheme'
                                            onClick={handleSubmit}
                                            disabled={
                                                isSubmitting ||
                                                storesData.length === 0
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
                    </div>
                </form>
            </div>
            {/* Show loading spinner over entire screen while submitting*/}
            {isSubmitting && (
                <div className='fixed inset-0 z-9999 flex items-center justify-center cursor-wait'>
                    <Loader2 className='animate-spin text-myDarkbrown h-12 w-12' />
                </div>
            )}
        </div>
    );
}

// Accepts integers only
// const OrderCell = ({
//     getValue,
//     row,
//     column,
//     table,
// }: CellContext<MilkBreadOrder, number | null>) => {
//     const initialValue = getValue();
//     const [value, setValue] = useState<string>(
//         initialValue?.toString() ?? ''
//     );
//     // const inputref = useRef<HTMLInputElement>(null);

//     const handleBlur = () => {
//         const numValue = value === '' ? null : parseInt(value);
//         (table.options.meta as TableMeta<MilkBreadOrder>).updateData(
//             row.index,
//             column.id,
//             numValue
//         );

//         // table.options.meta?.updateData(row.index, column.id, value);
//     };

//     const focusNextInput = (currentRowIndex: number) => {
//         const nextRowIndex = currentRowIndex + 1;

//         // Use setTimeout to ensure DOM is ready
//         setTimeout(() => {
//             try {
//                 // Try to find next input directly by row index
//                 const nextInput = document.querySelector(
//                     `input[data-row-index="${nextRowIndex}"][data-column-id="${column.id}"]`
//                 ) as HTMLInputElement;

//                 if (nextInput) {
//                     nextInput.focus();
//                     nextInput.select(); // Optional: select the text
//                 } else {
//                     console.log('No next input found');
//                 }
//             } catch (error) {
//                 console.error('Focus error:', error);
//             }
//         }, 10);
//     };

//     const handleKeyDown = (
//         event: React.KeyboardEvent<HTMLInputElement>
//     ) => {
//         if (event.key === 'Enter' || event.key === 'Tab') {
//             event.preventDefault();
//             event.stopPropagation();

//             // Save the current value
//             const numValue = value === '' ? null : parseInt(value);
//             (table.options.meta as TableMeta<MilkBreadOrder>).updateData(
//                 row.index,
//                 column.id,
//                 numValue
//             );

//             // Focus next input
//             focusNextInput(row.index);
//         }
//     };

//     return (
//         <Input
//             type='number'
//             // ref={inputRef}
//             // value={value}
//             // value={value ?? ''}
//             value={value !== null ? value : ''}
//             onChange={(e) =>
//                 e.target.value.includes('.')
//                     ? setValue('')
//                     : setValue(e.target.value)
//             }
//             // onKeyDown=""
//             onBlur={handleBlur}
//             onKeyDown={handleKeyDown}
//             data-row-index={row.index}
//             data-column-id={column.id}
//             className='h-6 text-center'
//             min='0'
//             // step="0.5"
//             placeholder='0'
//         />
//     );
// };
