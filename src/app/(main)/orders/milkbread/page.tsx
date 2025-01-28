'use client';
import React, { useState, useEffect } from 'react';
import PagesNavBar from "@/components/pages-navbar";
import noMilkBreadPic from '/public/illustrations/groceries.svg';
import Image from 'next/image';
import { TodaysDate } from '@/components/todays-date';
// import { Button } from '@/components/ui/button';

interface Item {
    id: number;
    name: string;
    // due_date: string;
    units: string;
    stock_qty: number | null;
    vendor_id: number;
    // store_categ: string;
    // stage: string;
}

export default function MilkBread(){
    const [data, setData] = useState<Item[]>([]);
    return (
        <div className="mt-6">
            <div>
                <h1 className="text-3xl">Orders <TodaysDate/></h1>
            </div>
            <div className="mb-6">
                <PagesNavBar/>
            </div>
            {
                data?.length > 0 ? (
                    <>
                        <p>Milk & Bread orders here...</p>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                        <Image
                            src={noMilkBreadPic}
                            alt='no milk & bread orders pic'
                            width={250}
                            height={250}
                        />
                        <p className="text-2xl text-gray-600">No Milk & Bread Orders!</p>
                        <p className="text-sm text-gray-400">All orders have been processed</p>
                        {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                    </div>
                )

            }
        </div>
    )
}