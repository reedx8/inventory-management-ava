'use client';
import React, { useEffect, useState } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
import noInventoryPic from '/public/illustrations/breakfast.svg';
import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import { ItemInfo } from '@/components/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import placeholder from '/public/placeholder.jpg';
import { Skeleton } from '@/components/ui/skeleton';
import redDot from '/public/icons/redDot.png';
import greenDot from '/public/icons/greenDot.png';
import verticalLine from '/public/verticalLine.png';
import { Badge } from '@/components/ui/badge';
import {
    Beef,
    Coffee,
    Dessert,
    Milk,
    Search,
    Wheat,
    Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';

export default function Manage() {
    const [data, setData] = useState<ItemInfo[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Uses cron_categ
    function selectIcon(categ: string | undefined) {
        const iconStyle = 'text-myBrown w-5 h-5';
        if (categ === 'MILK') {
            return <Milk className={iconStyle} />;
        } else if (categ === 'PASTRY') {
            return <Dessert className={iconStyle} />;
        } else if (categ === 'RETAILBEANS') {
            return <Coffee className={iconStyle} />;
        } else if (categ === 'MEATS') {
            return <Beef className={iconStyle} />;
        } else if (categ === 'BREAD') {
            return <Wheat className={iconStyle} />;
        } else {
            return <Utensils className={iconStyle} />;
        }
    }
    const openItem = (id: number) => {
        console.log(`${id}: item clicked`)
    }

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const response = await fetch('api/v1/manage?fetch=allItems');
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error);
                }

                setData(result);
            } catch (error) {
                const err = error as Error;
                console.log(err);
                setData([]);
            }

            setIsLoading(false);
        };
        fetchAllItems();
    }, []);

    return (
        <main>
            <HeaderBar pageName={'Manage'} />
            <section>
                <PagesNavBar />
            </section>
            <section>
                {isLoading && !data && (
                    <div className='flex flex-wrap gap-3'>
                        <div className='flex flex-col space-y-3'>
                            <Skeleton className='h-[75px] w-full rounded-xl' />
                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-[80%]' />
                                <Skeleton className='h-4 w-[60%]' />
                            </div>
                        </div>
                    </div>
                )}
                {!isLoading && data && data.length > 0 && (
                    <ScrollArea className='h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-y-auto py-3 pr-3'>
                        <div className='flex flex-wrap gap-4'>
                            {data.map((item) => (
                                <Button
                                    key={item.id}
                                    className='w-full h-[90px] p-0'
                                    // asChild
                                    variant='ghost'
                                    onClick={() => openItem(item.id)}
                                >
                                    <Card
                                        className='w-full py-1 shadow-md hover:-translate-y-2 hover:bg-neutral-50 duration-300'
                                        // className='w-full h-[90px] py-1 hover:-translate-y-2 hover:bg-neutral-50 duration-300 shadow-md'
                                        // key={item.id}
                                    >
                                        <CardContent className='grid grid-cols-[auto_1fr] gap-8'>
                                            <div className='flex flex-col justify-center items-center h-full'>
                                                <Image
                                                    src={placeholder}
                                                    alt='placeholder logo'
                                                    width={50}
                                                    height={50}
                                                    className='rounded-lg'
                                                />
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-4'>
                                                    <h2 className='text-lg flex items-center gap-1'>
                                                        {item.is_active ? (
                                                            <Image
                                                                src={greenDot}
                                                                alt='enabled'
                                                                width={15}
                                                                // height={10}
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={redDot}
                                                                alt='disabled'
                                                                width={15}
                                                            />
                                                        )}
                                                        {item.name}
                                                    </h2>
                                                    {selectIcon(
                                                        item.cron_categ
                                                    )}
                                                    <Badge
                                                        variant='secondary'
                                                        className='text-xs text-myDarkbrown font-light bg-myBrown'
                                                    >
                                                        {item.invoice_categ ??
                                                            ''}
                                                    </Badge>
                                                </div>
                                                <div className='flex flex-col items-start'>
                                                    <p className='text-xs text-neutral-500'>
                                                        Vendor:{' '}
                                                        <span className='text-neutral-500'>
                                                            {item.vendor_name ??
                                                                '--'}
                                                        </span>
                                                    </p>
                                                    <p className='text-xs text-wrap text-neutral-500'>
                                                        Unit:{' '}
                                                        <span className='text-neutral-500'>
                                                            {item.units ?? '--'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                )}
                {!isLoading && data && data.length <= 0 && (
                    <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                        <Image
                            src={noInventoryPic}
                            alt='no inventory pic'
                            width={375}
                            height={375}
                            className='drop-shadow-lg'
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
            </section>
        </main>
    );
}
