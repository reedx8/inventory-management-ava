'use client';
import React, { useState, useEffect } from 'react';
import noPastriesPic from '/public/illustrations/cooking.svg';
import Image from 'next/image';
import { HeaderBar } from '@/components/header-bar';
import { BakeryOrder } from '@/app/(main)/bakery/types';
import { BakeryColumns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
// import { Button } from '@/components/ui/button';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import enIcon from '/public/icons/enIcon.png';
import esIcon from '/public/icons/esIcon.png';

// const dummyData: BakeryOrder[] = [
//     {
//         id: 1,
//         name: 'Peach & Cream Cheese Turnover',
//         units: '1 Pc',
//         order_qty: 23,
//         is_complete: false,
//     },
//     {
//         id: 2,
//         name: 'Blueberry Muffin',
//         units: '1 Pc',
//         order_qty: 18,
//         is_complete: false,
//     },
//     {
//         id: 3,
//         name: 'Croissant',
//         units: '1 Pc',
//         order_qty: undefined,
//         is_complete: false,
//     },
//     {
//         id: 4,
//         name: 'Cheese Bagel',
//         units: '4 Pcs/Pack',
//         order_qty: 12,
//         is_complete: false,
//     },
//     {
//         id: 5,
//         name: 'Strawberry Whip Cream Cake (Quarter)',
//         units: '1/4 Cake',
//         order_qty: 29,
//         is_complete: false,
//     },
//     {
//         id: 6,
//         name: 'Chocolate Chip Muffin',
//         units: '1 Pc',
//         order_qty: 44,
//         is_complete: false,
//     },
//     {
//         id: 7,
//         name: 'Pecan Cranberry Muffin',
//         units: '1 Pc',
//         order_qty: undefined,
//         is_complete: false,
//     },
//     {
//         id: 8,
//         name: 'Zu Zus',
//         units: '12 Pcs/Pack',
//         order_qty: 2,
//         is_complete: false,
//     },
//     {
//         id: 9,
//         name: 'Napoleon',
//         units: '1 Pc',
//         order_qty: undefined,
//         is_complete: false,
//     },
//     {
//         id: 10,
//         name: 'Macaroon',
//         units: '1 Pc',
//         order_qty: 16,
//         is_complete: false,
//     },
//     {
//         id: 11,
//         name: 'Fruit Tart',
//         units: '1 Pc',
//         order_qty: 67,
//         is_complete: false,
//     },
// ];

export default function Bakery() {
    const [data, setData] = useState<BakeryOrder[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    useEffect(() => {
        const getBakerysOrders = async () => {
            try {
                const response = await fetch('/api/v1/bakerys-orders');
                const data = await response.json();

                if (!response.ok) {
                    const msg = `Failed to fetch bakery's orders`;
                    throw new Error(msg);
                }

                setData(data);
            } catch (error) {
                // console.error('Error fetching bakerys orders:', error);
                const err = error as Error;

                toast({
                    title: 'Error Fetching Orders',
                    description: err.message,
                    variant: 'destructive',
                });
            }
        };

        getBakerysOrders();
        setIsLoading(false);
    }, [toast]);

    return (
        <main>
            <HeaderBar pageName={'Bakery'} />
            {/* <div className='mb-6'><PagesNavBar /></div> */}
            <section className='mb-6' />
            {isLoading && (
                <section className='flex flex-col gap-3'>
                    <Skeleton className='h-12 w-[80%]' />
                    <Skeleton className='h-6 w-[80%]' />
                    <Skeleton className='h-6 w-[65%]' />
                    <Skeleton className='h-6 w-[50%]' />
                </section>
            )}
            {!isLoading && data && data?.length > 0 && (
                <section className='flex flex-col'>
                    <DataTable columns={BakeryColumns} data={data} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant='myTheme'
                                className='w-fit self-end'
                            >
                                Auto-Complete Orders
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <Tabs defaultValue='english' className='flex flex-col'>
                                <TabsList className='flex self-center bg-neutral-200'>
                                    <TabsTrigger value='english' className='flex items-center gap-1'>
                                        EN <Image src={enIcon} alt='en' width={15} height={15} />
                                    </TabsTrigger>
                                    <TabsTrigger value='spanish' className='flex items-center gap-1'>
                                        ES <Image src={esIcon} alt='es' width={15} height={15} />
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='english'>
                                    {englishTab()}
                                </TabsContent>
                                <TabsContent value='spanish'>
                                    {spanishTab()}
                                </TabsContent>
                            </Tabs>
                        </AlertDialogContent>
                        {/* <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Complete All Orders?{' '}
                                    <div className='text-neutral-400 text-xs'>
                                        ¿Completar todos los pedidos?
                                    </div>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Press Submit only if all orders were
                                    successfully completed
                                    <div className='text-neutral-400 text-xs font-normal'>
                                        Presione Enviar solo si todos los
                                        pedidos se completaron correctamente
                                    </div>
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    Otherwise, Press Cancel
                                    <div className='text-neutral-400 text-xs font-normal'>
                                        De lo contrario, presione Cancelar
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button variant='myTheme'>Submit</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent> */}
                    </AlertDialog>
                    {/* <Button variant='myTheme' size='lg' className='w-fit self-end'>
                        Auto-Complete Orders
                    </Button> */}
                </section>
            )}
            {!isLoading && data && data?.length === 0 && (
                <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noPastriesPic}
                        alt='no pastries pic'
                        width={250}
                        height={250}
                        className='drop-shadow-lg'
                    />
                    <p className='text-2xl text-gray-600'>No Pastries Due!</p>
                    <p className='text-sm text-gray-400'>
                        All pastries have been delivered today
                    </p>
                    {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                </section>
            )}
        </main>
    );
}

function englishTab() {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Complete All Orders? </AlertDialogTitle>
                <AlertDialogDescription>
                    Press Submit only if all orders were successfully completed
                </AlertDialogDescription>
                <AlertDialogDescription>
                    Otherwise, Press Cancel
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button variant='myTheme'>Submit</Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </>
    );
}

function spanishTab() {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    ¿Completar Todos Los Pedidos?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Presione Enviar solo si todos los pedidos se completaron
                    correctamente
                </AlertDialogDescription>
                <AlertDialogDescription>
                    De lo contrario, presione Cancelar
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button variant='myTheme'>Enviar</Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </>
    );
}
