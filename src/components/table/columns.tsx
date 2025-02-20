'use client';
import { BakeryOrder } from '@/app/(main)/bakery/types';
import { ColumnDef } from '@tanstack/react-table';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ArrowUpDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { STORE_LOCATIONS } from '@/components/types';

export const BakeryColumns: ColumnDef<BakeryOrder>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => {
            return (
                <div>
                    <p>{`${info.row.original.name}`}</p>
                    <p className='text-neutral-500/70 text-xs'>{` ${info.row.original.units ?? ''}`}</p>
                </div>
            );
        },
    },
    // {
    //     accessorKey: 'units',
    //     header: 'Units',
    // },
    ...STORE_LOCATIONS.map((store) => ({
        // this creates a table for for each store, and outputs its store's order qty for that item
        id: `store_${store}`, // unique id for each column
        header: store,
        accessorFn: (row: {
            store_data: Array<{ store_name: string; order_qty: number }>;
        }) => {
            const storeData = row.store_data?.find(
                (data) => data.store_name === store
            );
            return storeData?.order_qty ?? '-';
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
        header: 'Total',
    },
];

// export const VendorColumns: ColumnDef<VendorContact>[] = [
//     {
//         accessorKey: 'name',
//         header: 'Name',
//     },
//     {
//         accessorKey: 'email',
//         header: 'Email',
//     },
//     {
//         accessorKey: 'phone',
//         header: 'Phone',
//     },
// ];