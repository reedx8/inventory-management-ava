'use client';
import PagesNavBar from '@/components/pages-navbar';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { HeaderBar } from '@/components/header-bar';
import { useAuth } from '@/contexts/auth-context';
import OrderTable from './components/order-table';
import { OrderItem } from '@/app/(main)/store/types';
import { NoStoreOrdersDue } from '@/components/placeholders';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Stores() {
    const { userRole, userStoreId } = useAuth();
    const [mergedData, setMergedData] = useState<OrderItem[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    useEffect(() => {
        const fetchStoreOrders = async () => {
            try {
                let regResponse;
                let bakeryResponse;

                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tom_dow_num = tomorrow.getDay();

                if (userRole === 'admin') {
                    [regResponse, bakeryResponse] = await Promise.all([
                        fetch(`/api/v1/store-orders?dow=${tom_dow_num}`),
                        fetch(`/api/v1/store-bakery-orders?dow=${tom_dow_num}`),
                    ]);
                } else if (userRole === 'store_manager') {
                    [regResponse, bakeryResponse] = await Promise.all([
                        fetch(
                            `/api/v1/store-orders?storeId=${userStoreId}&dow=${tom_dow_num}`
                        ),
                        fetch(
                            `/api/v1/store-bakery-orders?storeId=${userStoreId}&dow=${tom_dow_num}`
                        ),
                    ]);
                } else {
                    // dont fetch orders for other roles
                    return;
                }

                const [regData, bakeryData] = await Promise.all([
                    regResponse.json(),
                    bakeryResponse.json(),
                ]);
                // const data = await response.json();
                // const theBakeryData = await response2.json();
                if (regResponse.ok && bakeryResponse.ok) {
                    const mergedOrders = [...regData, ...bakeryData];
                    setMergedData(mergedOrders);
                    console.log('mergedOrders: ', mergedOrders);
                } else {
                    throw new Error(
                        'Store Orders Error: ' +
                            (regData.error || 'Ok') +
                            `\nBakery Orders Error: ` +
                            (bakeryData.error || 'Ok')
                    );
                }
            } catch (error) {
                console.error(error);
                setMergedData([]);
                // setData([]);
                // setStoreData([]);
            }
            setIsLoading(false);
        };
        fetchStoreOrders();
    }, [userRole, userStoreId, refreshTrigger]);

    return (
        <main>
            <HeaderBar pageName={'Store'} />
            <section className='flex justify-between items-center'>
                <PagesNavBar />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant='myTheme3'>
                            <Info /> <p className='text-xs'>Info</p>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='mr-2 flex flex-col gap-2 text-neutral-500 text-sm'>
                        <p>{`Your store's due orders are filtered by store categories (stockroom, front counter, etc) and are due either on a daily or weekly basis.`}</p>
                        <p>{`You can autofill orders with the item's PAR level
                        using the 'Autofill Orders' button.`}</p>
                        <p>
                            Clicking submit will submit all orders for that
                            store category only.
                        </p>
                    </PopoverContent>
                </Popover>
            </section>
            {isLoading && !mergedData && (
                <section className='flex flex-col gap-3'>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                </section>
            )}
            {!isLoading && mergedData && mergedData?.length > 0 && (
                <OrderTable
                    data={mergedData}
                    setData={setMergedData}
                    storeId={userStoreId}
                    setRefreshTrigger={setRefreshTrigger}
                />
            )}
            {!isLoading && mergedData && mergedData?.length <= 0 && (
                // <div className='flex flex-col justify-center'>
                <section className='flex justify-center'>
                    <NoStoreOrdersDue />
                </section>
                // </div>
            )}
        </main>
    );
}
