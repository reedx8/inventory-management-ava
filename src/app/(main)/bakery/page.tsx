'use client';
// import StoreNavsBar from '@/components/stores-navbar';
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
// import { Dot } from 'lucide-react';
import noPastriesPic from '/public/illustrations/cooking.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';

interface Item {
    id: number;
    name: string;
    due_date: string;
    units: string;
    order_qty: number | null;
    store_categ: string;
    // stage: string;
}

export default function Bakery() {
    const [data, setData] = useState<Item[]>([]);
    return (
        <div className='mt-6'>
            <HeaderBar pageName={'Bakery'} />
            <div className='mb-6'>
                {/* <StoreNavsBar /> */}
            </div>
            {
                data?.length > 0 ? (
                    <>
                    <p>Pastries here</p>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                        <Image
                            src={noPastriesPic}
                            alt='no pastries pic'
                            width={250}
                            height={250}
                        />
                        <p className="text-2xl text-gray-600">No Pastries Due!</p>
                        <p className="text-sm text-gray-400">All pastries have been delivered today</p>
                        {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                    </div>
                )
            }
        </div>
    );
}
