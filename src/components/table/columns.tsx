'use client';
import { BakeryOrder } from '@/app/(main)/bakery/types';
import { ColumnDef } from '@tanstack/react-table';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ArrowUpDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { STORE_LOCATIONS } from '@/components/types';

// Used for bakery's table
export const BakeryColumns: ColumnDef<BakeryOrder>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => {
            return (
                <p>{`${info.row.original.name}`}</p>
                // {/* <p className='text-neutral-500/70 text-xs'>{` ${info.row.original.units ?? ''}`}</p> */}
            );
        },
    },
    ...STORE_LOCATIONS.map((store) => ({
        // this creates a column for for each store, and outputs its store's order qty for that item
        id: `store_${store}`, // unique id for each column
        header: store.toLowerCase() === 'progress' ? 'Barrows' : store,
        accessorFn: (row: {
            store_data: Array<{ store_name: string; order_qty: number | null }>;
        }) => {
            const storeData = row.store_data?.find(
                (data) => data.store_name === store
            );

            if (storeData === null){
                return '-'
            } else if(storeData && storeData.order_qty !== null) {
                return storeData.order_qty;
            } else {
                return '-';
            }

            // return storeData?.order_qty ?? '-';
        },
        // cell: ({ getValue }) => {
        //     // cell: simply centers the cell content
        //     const value = getValue();
        //     return (
        //         <div className='text-center'>
        //             <p>{value}</p>
        //         </div>
        //     );
        // },
    })),
    {
        accessorKey: 'order_qty',
        header: () => (
            <div className='font-semibold text-right'>
                <p className='font-semibold'>Total</p>
            </div>
        ),
        cell: (info) => {
            return (
                <p className='text-right'>
                    {Number(Number(info.row.original.order_qty).toFixed(2))}
                </p>
            );
        },
    },
];