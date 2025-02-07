'use client';
import React, { useState, useEffect } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
import noInventoryPic from '/public/illustrations/breakfast.svg';
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
            <HeaderBar pageName={'Manage'} />
            <div className='mb-6'>
                <PagesNavBar />
            </div>
            {data?.length > 0 ? (
                <>
                    <p>Inventory here...</p>
                </>
            ) : (
                <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noInventoryPic}
                        alt='no inventory pic'
                        width={375}
                        height={375}
                    />
                    <p className='text-2xl text-gray-600'>No Inventory!</p>
                    <p className='text-sm text-gray-400'>
                        No items have been added yet
                    </p>
                    {/* <Button size='lg' variant='myTheme'>
                        Add Item
                    </Button> */}
                </div>
            )}
        </div>
    );
}
