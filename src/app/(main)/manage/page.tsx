'use client';
import React, { useState, useEffect } from 'react';
import PagesNavBar from "@/components/pages-navbar";
import { TodaysDate } from "@/components/todays-date";
import breakfastPic from '/public/illustrations/breakfast.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Item {
    id: number;
    name: string;
    units: string;
    store_categ: string;
    invoice_categ: string;
    list_price: number;
    // stage: string;
}

export default function Manage() {
    const [data, setData] = useState<Item[]>([]);
    return (
        <div className='mt-6'>
            <div>
                <h1 className='text-3xl'>Manage <TodaysDate/></h1>
            </div>
            <div className='mb-6'>
                <PagesNavBar/>
            </div>
            {
                data?.length > 0 ? (
                    <>
                        <p>Inventory here...</p>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                        <Image
                            src={breakfastPic}
                            alt='no inventory pic'
                            width={300}
                            height={300}
                        />
                        <p className="text-xl text-gray-600">No Inventory!</p>
                        <p className="text-sm text-gray-400">No items have been added. Add some!</p>
                        <Button size='lg' variant='myTheme'>Create Item</Button>
                    </div>
                )
            }
        </div>
    );
}
