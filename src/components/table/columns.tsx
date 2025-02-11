'use client';
import { BakeryOrder } from '@/app/(main)/bakery/types';
import { ColumnDef } from '@tanstack/react-table';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ArrowUpDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';

export const BakeryColumns: ColumnDef<BakeryOrder>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'units',
        header: 'Units',
    },
    {
        accessorKey: 'order_qty',
        header: 'Quantity',
    },
];
