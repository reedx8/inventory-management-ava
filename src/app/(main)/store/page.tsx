'use client';
import PagesNavBar from '@/components/pages-navbar';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { HeaderBar } from '@/components/header-bar';
import { useAuth } from '@/contexts/auth-context';
import OrderTable from './components/order-table';
import { OrderItem } from '@/app/(main)/store/types';
import { LoadingTable, NoStoreOrdersDue } from '@/components/placeholders';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Edit2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SheetTemplate from '@/components/sheet/sheet-template';
// import SheetData from '@/components/sheet/sheet-data';
import ParsData from './components/pars-data';
import { ctcCCPToday } from '@/components/schedules';
// import { Badge } from '@/components/ui/badge';

export default function Stores() {
    const { userRole, userStoreId } = useAuth();
    const [mergedData, setMergedData] = useState<OrderItem[] | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [refreshParentOnParChange, setRefreshParentOnParChange] =
        useState<number>(0);

    useEffect(() => {
        const fetchAllOrders = async () => {
            setIsLoading(true);
            try {
                // let regResponse;
                let bakeryResponse;
                let bakeryData;
                let vendorResponse;
                let vendorData;

                // to get the correct par values for pastries (want tomorrow's par values for pastry items):
                // const today = new Date();
                const tom = new Date();
                tom.setDate(tom.getDate() + 1);
                const tomDowNum = tom.getDay();

                if (userRole === 'admin') {
                    bakeryResponse = await fetch(
                        `/api/v1/store-bakery-orders?dow=${tomDowNum}`
                    );
                    bakeryData = await bakeryResponse.json();

                    if (!bakeryResponse.ok) {
                        throw new Error(bakeryData.error);
                    }

                    // if (ctcCCPToday(new Date().getDay())) {
                    vendorResponse = await fetch(
                        `/api/v1/store-orders?dow=${tomDowNum}`
                    );
                    vendorData = await vendorResponse.json();

                    if (!vendorResponse.ok) {
                        throw new Error(vendorData.error);
                    }
                    // }

                    // set data all at once to avoid setting same state multiple times, causing different renders
                    setMergedData([...bakeryData, ...(vendorData || [])]);
                } else if (userRole === 'store_manager') {
                    bakeryResponse = await fetch(
                        `/api/v1/store-bakery-orders?storeId=${userStoreId}&dow=${tomDowNum}`
                    );
                    bakeryData = await bakeryResponse.json();

                    if (!bakeryResponse.ok) {
                        throw new Error(bakeryData.error);
                    }

                    // if (ctcCCPToday(new Date().getDay())){
                    vendorResponse = await fetch(
                        `/api/v1/store-orders?storeId=${userStoreId}&dow=${tomDowNum}`
                    );
                    vendorData = await vendorResponse.json();

                    if (!vendorResponse.ok) {
                        throw new Error(vendorData.error);
                    }
                    // }

                    setMergedData([...bakeryData, ...(vendorData || [])]);
                }
            } catch (error) {
                console.error(error);
                setMergedData([]);
            }
            setIsLoading(false);
        };

        fetchAllOrders();
    }, [userRole, userStoreId, refreshTrigger, refreshParentOnParChange]);

    return (
        <main>
            <HeaderBar pageName={'Store'} />
            <section className='flex justify-between items-center'>
                <PagesNavBar />
                <div className='flex gap-1 items-center'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant='ghost'
                                className='flex gap-2 text-myDarkbrown hover:bg-transparent hover:text-myDarkbrown/60'
                            >
                                <Info /> <p className='text-xs'>Info</p>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='mr-2 flex flex-col gap-2 text-neutral-500 text-sm'>
                            <p>{`Your store's due orders are filtered by store categories (stockroom, front counter, etc) and are due either on a daily or weekly basis.`}</p>
                            <p>{`You can autofill orders with the item's PAR level
                        using 'Autofill Orders', and edit their levels using 'Edit PARS'.`}</p>
                            <p>
                                Clicking submit on Orders Due page will submit
                                all orders for that store category only.
                            </p>
                        </PopoverContent>
                    </Popover>
                    <SheetTemplate
                        trigger={
                            <Button variant='myTheme3'>
                                <Edit2 /> <p className='text-xs'>Edit PARS</p>
                            </Button>
                        }
                        title='Edit PAR Levels'
                        description={`Edit your store's PAR levels here. PAR levels are the minimum amount of stock you should have on hand for that specified day or week, and are used to autofill orders.`}
                        isCollapsible={true}
                    >
                        <ParsData
                            storeId={userStoreId}
                            role={userRole}
                            setRefreshParent={setRefreshParentOnParChange}
                        />
                        {/* {userRole === 'store_manager' ? (
                            <ParsData storeId={userStoreId} role={userRole} setRefreshParent={setRefreshParentOnParChange} />
                            // <SheetData storeId={userStoreId} contentType='store:par' setRefreshParent={setRefreshParentOnParChange} />
                        ) : (
                            <p className='text-neutral-500 text-sm text-center mt-4'>Admin view work in progress</p>
                        )} */}
                    </SheetTemplate>
                </div>
            </section>
            {isLoading && (
                <LoadingTable />
            )}
            {!isLoading && mergedData && mergedData?.length > 0 && (
                <OrderTable
                    data={mergedData}
                    setData={setMergedData}
                    storeId={userStoreId}
                    setRefreshParentTrigger={setRefreshTrigger}
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
