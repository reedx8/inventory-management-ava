'use client';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import noVendorsPic from '/public/illustrations/underConstruction.svg';
import Image from 'next/image';
import { VendorContact } from '@/components/types';
import { useState, useEffect } from 'react';
import noVendorsPic from '/public/illustrations/account.svg';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import placeholder from '/public/placeholder.jpg';

export default function Contact() {
    const [data, setData] = useState<VendorContact[] | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getVendorContacts = async () => {
            try {
                const response = await fetch('api/v1/vendor-contacts');
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message);
                }
                setData(result);
            } catch (error) {
                const err = error as Error;
                console.log(err);
                setData([]);
            }
            setIsLoading(false);
        };
        getVendorContacts();
    }, []);

    // console.log('data: ', data);

    return (
        <main>
            <HeaderBar pageName={'Contact'} />
            <section>
                <PagesNavBar />
            </section>
            <section>
                {isLoading && !data && (
                    <div className='flex gap-3'>
                        <div className='flex flex-col space-y-2 w-full'>
                            <Skeleton className='h-[75px] w-[100%] rounded-xl' />
                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-[85%]' />
                                <Skeleton className='h-4 w-[80%]' />
                            </div>
                        </div>
                    </div>
                )}
                {!isLoading && data && data.length > 0 && (
                    <ScrollArea className='h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-y-auto py-3 pr-3'>
                        <div className='flex flex-wrap gap-3'>
                            {data.map((vendor) => (
                                <Card
                                    className='w-full h-[90px] py-1 hover:-translate-y-1 hover:bg-neutral-50 duration-300 shadow-md'
                                    key={vendor.id}
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
                                        <div>
                                            <h2 className='text-lg'>
                                                {vendor.name}
                                            </h2>
                                            <p className='text-xs text-neutral-500'>
                                                Phone: <span className='text-neutral-500'>{vendor.phone ?? '--'}</span>
                                            </p>
                                            <p className='text-xs text-wrap text-neutral-500'>
                                                Email: <span className='text-neutral-500'>{vendor.email ?? '--'}</span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                )}
                {!isLoading && data && data.length <= 0 && (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <Image
                            src={noVendorsPic}
                            alt='no vendors pic'
                            width={300}
                            height={300}
                            className='drop-shadow-lg'
                            // style={{ width: '300px', height: '300px' }}
                        />
                        <h1 className='text-3xl text-gray-600'>
                            No Vendor Contacts
                        </h1>
                        <p className='text-sm text-gray-400'>
                            There are no vendors at this time.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
