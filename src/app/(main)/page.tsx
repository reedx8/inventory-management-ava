'use client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CalendarDays,
    Box,
    Cake,
    ChevronDown,
    Store,
    Milk,
    // ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { HeaderBar, todaysDay } from '@/components/header-bar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
// import Link from 'next/link';

const orderSchedule = [
    {
        day: 'Monday',
        itemsDue: 'Pastries',
    },
    {
        day: 'Tuesday',
        itemsDue: (
            <ul className='list-decimal list-inside'>
                <li>- Pastries</li>
                <li>- CCP/Sysco Weekly Orders</li>
            </ul>
        ),
        // itemsDue: 'Pastries, CCP/Sysco Weekly Orders',
    },
    {
        day: 'Wednesday',
        itemsDue: (
            <ul className='list-decimal list-inside'>
                <li>- Pastries</li>
                <li>- CTC Weekly Orders</li>
            </ul>
        ),
        // itemsDue: 'Pastries, CTC Weekly Orders',
    },
    {
        day: 'Thursday',
        itemsDue: 'Pastries',
    },
    {
        day: 'Friday',
        itemsDue: 'Pastries',
    },
    {
        day: 'Saturday',
        itemsDue: 'Pastries',
    },
    {
        day: 'Sunday',
        itemsDue: 'Pastries',
    },
];

const invSchedule = [
    {
        day: 'Monday',
        itemsDue: 'Milk & Bread',
    },
    {
        day: 'Tuesday',
        itemsDue: 'Weekly Stock Count',
    },
    {
        day: 'Wednesday',
        itemsDue: 'CTC Stock Count',
    },
    {
        day: 'Thursday',
        itemsDue: 'Milk',
    },
    {
        day: 'Friday',
        itemsDue: '-',
    },
    {
        day: 'Saturday',
        itemsDue: '-',
    },
    {
        day: 'Sunday',
        itemsDue: '-',
    },
];

export type DashboardType = {
    bakeryDueTodayCount: number | null;
    itemCount: number | undefined;
    storeCount: number | undefined;
    milkBreadDueTodayCount: number | undefined;
};

export default function Home() {
    const { userRole, userStoreId } = useAuth();
    const [dashboard, setDashboard] = useState<DashboardType>({
        bakeryDueTodayCount: null,
        itemCount: undefined,
        storeCount: undefined,
        milkBreadDueTodayCount: undefined,
    });
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const todaysDate : string = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const getDashboardData = async (storeId: number) => {
            try {
                const dow = todaysDay();
                const response = await fetch(
                    'api/v1/dashboard?fetch=all&storeId=' +
                        storeId +
                        '&dow=' +
                        dow
                );
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                setDashboard(result);
            } catch (error) {
                const err = error as Error;
                console.log('Dashboard data fetch failed: ' + err);
                setDashboard({
                    bakeryDueTodayCount: 0,
                    itemCount: 0,
                    storeCount: 0,
                    milkBreadDueTodayCount: 0,
                });
            }
        };
        // const storeId = userStoreId ?? 0;
        if (userRole && userRole !== 'store_manager') {
            getDashboardData(0);
        } else if (userStoreId) {
            getDashboardData(userStoreId);
        }
    }, [userStoreId, userRole]);

    return (
        <main>
            <HeaderBar pageName={'Home'} />
            <section className='flex justify-between items-center rounded-xl shadow-md border bg-white p-4 mt-2 text-black/80'>
                <div>
                    <h2 className='text-md'>
                        Inventory Management System
                        <span className='text-neutral-400 text-sm'> (IMS)</span>
                    </h2>
                </div>
                <div className='flex flex-col items-end'>
                    <h2 className='flex items-center'>
                        <Store width={17} className='mr-1 text-myBrown' /> Store
                        Locations:{' '}
                        <span className='ml-1 text-lg'>
                            {dashboard.storeCount === undefined
                                ? '-'
                                : dashboard.storeCount}
                            {/* {storeCount === undefined ? '--' : storeCount} */}
                        </span>
                    </h2>
                    <h2 className='flex items-center'>
                        <Box width={17} className='mr-1 text-myBrown' />
                        Item Count:
                        <span className='ml-1 text-lg'>
                            {dashboard.itemCount === undefined
                                ? '-'
                                : dashboard.itemCount}
                            {/* {itemCount === undefined ? '--' : itemCount} */}
                        </span>
                    </h2>
                </div>
            </section>
            <section className='flex flex-col gap-2 mt-4'>
                {/* <div>
                    <OpenCakeOrders />
                </div> */}
                <h2 className='text-2xl flex'>Due Today {scheduleBtn()}</h2>
                <div className='flex flex-wrap gap-3 sm:grid sm:grid-cols-[auto_1fr] sm:gap-3'>
                    <Card className='shadow-md flex flex-col items-center min-w-[250px]'>
                        <CardHeader className='text-center'>
                            <CardTitle className='font-normal'>
                                Orders Due
                            </CardTitle>
                            <CardDescription className='text-neutral-400 text-balance'>
                                Store orders due today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {miniOrderCards(dashboard.bakeryDueTodayCount)}
                            {/* {miniOrderCards(bakeryDueTodayCount)} */}
                        </CardContent>
                    </Card>
                    <Card className='shadow-md flex flex-col items-center'>
                        <CardHeader className='text-center'>
                            <CardTitle className='font-normal'>
                                Stock Due
                            </CardTitle>
                            <CardDescription className='text-neutral-400 text-balance'>
                                Stock counts due today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {miniStockCards(dashboard.milkBreadDueTodayCount)}
                        </CardContent>
                    </Card>
                </div>
                {/* <div className='flex-1 h-full'>{CarouselComponent()}</div> */}
            </section>
        </main>
    );
}

function scheduleBtn() {
    return (
        <div className='ml-4'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant='outline' size='sm'>
                        <CalendarDays className='h-4 w-4' />
                        Schedule
                        <ChevronDown className='ml-2 h-4 w-4' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Tabs className='text-sm'>
                        {/* <div className='flex justify-center'> */}
                        <TabsList className='grid grid-cols-2 w-full'>
                            <TabsTrigger value='orders'>Orders</TabsTrigger>
                            <TabsTrigger value='stock'>Stock</TabsTrigger>
                        </TabsList>
                        {/* </div> */}
                        <TabsContent
                            value='orders'
                            className='flex flex-col gap-2'
                        >
                            {orderSchedule.map((item) =>
                                todaysDay() === item.day ? (
                                    <div
                                        key={item.day}
                                        className='grid grid-cols-2'
                                    >
                                        <p className='font-bold'>{item.day}</p>
                                        <div className='font-bold'>
                                            {item.itemsDue}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={item.day}
                                        className='grid grid-cols-2'
                                    >
                                        <p>{item.day}</p>
                                        <div>{item.itemsDue}</div>
                                    </div>
                                )
                            )}
                            <Separator className='my-1' />
                            <div className='flex flex-col gap-0 text-xs text-neutral-500'>
                                <p className='text-xs text-neutral-500 mb-1'>
                                    Note: These are due dates for all stores
                                </p>
                                <p className='italic'>
                                    CTC = Coffee, Tea, and Chocolate items
                                </p>
                                <p className='italic'>
                                    CCP = Cost Control Products
                                </p>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value='stock'
                            className='flex flex-col gap-2'
                        >
                            {invSchedule.map((item) =>
                                todaysDay() === item.day ? (
                                    <div
                                        key={item.day}
                                        className='grid grid-cols-2'
                                    >
                                        <p className='font-bold'>{item.day}</p>
                                        <p className='font-bold'>
                                            {item.itemsDue}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        key={item.day}
                                        className='grid grid-cols-2'
                                    >
                                        <p>{item.day}</p>
                                        <p>{item.itemsDue}</p>
                                    </div>
                                )
                            )}
                            <Separator className='my-1' />
                            <div className='flex flex-col gap-0 text-xs text-neutral-500'>
                                <p className='text-xs text-neutral-500 mb-1'>
                                    Note: These are due dates for all stores
                                </p>
                                <p className='italic'>
                                    CTC = Coffee, Tea, and Chocolate items
                                </p>
                                <p className='italic'>
                                    CCP = Cost Control Products
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
        </div>
    );
}

function miniOrderCards(bakeryDueTodayCount: number | null) {
    const invTypes = [
        {
            name: 'Pastries',
            count: bakeryDueTodayCount,
            icon: <Cake width={18} className='text-myBrown' />,
        },
        { name: 'Weekly Orders', count: 0 },
        { name: 'CTC', count: 0 },
    ];
    return (
        <div className='flex flex-wrap gap-2'>
            {invTypes.map((type) => (
                <div className='w-[125px]' key={type.name}>
                    <div className='flex h-[25px] w-full mb-1'>
                        <div className='w-full h-full text-center rounded-full bg-myBrown/30'>
                            {type.name}
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-5xl text-myBrown drop-shadow-sm'>
                            {type.count !== null ? type.count : '-'}
                            {/* {type.count ?? 0} */}
                        </p>
                        <div className='text-sm flex items-center justify-center gap-1'>
                            {type.icon ?? (
                                <Box width={18} className='text-myBrown' />
                            )}
                            Items
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
function miniStockCards(milkBreadDueTodayCount: number | undefined) {
    return (
        <div className='flex flex-wrap gap-2'>
                <div className='w-[125px]'>
                    <div className='flex h-[25px] w-full mb-1'>
                        <div className='w-full h-full text-center rounded-full bg-myBrown/30'>
                            Milk & Bread
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-5xl text-myBrown drop-shadow-sm'>
                            {milkBreadDueTodayCount !== undefined
                        ? milkBreadDueTodayCount
                        : '-'}
                            {/* {type.count ?? 0} */}
                        </p>
                        <div className='text-sm flex items-center justify-center gap-1'>
                            <Milk width={18} className='text-myBrown' />
                            Items
                        </div>
                    </div>
                </div>
                <div className='w-[125px]'>
                    <div className='flex h-[25px] w-full mb-1'>
                        <div className='w-full h-full text-center rounded-full bg-myBrown/30'>
                                Sunday Close
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-5xl text-myBrown drop-shadow-sm'>
                            {todaysDay().toLowerCase() === 'sunday' ? 'Yes' : 'No'}
                        </p>
                        <div className='text-sm flex items-center justify-center gap-1'>
                            <Box width={18} className='text-myBrown' />
                            Items
                        </div>
                    </div>
                </div>
        </div>
    );
    return (
        <div className='w-[125px]'>
            <div className='flex h-[25px] w-full mb-1'>
                <div className='w-full h-full text-center rounded-full bg-myBrown/30'>
                    Milk & Bread
                </div>
            </div>
            <div className='text-center'>
                <p className='text-5xl text-myBrown drop-shadow-sm'>
                    {milkBreadDueTodayCount !== undefined
                        ? milkBreadDueTodayCount
                        : '-'}
                    {/* {type.count ?? 0} */}
                </p>
                <div className='text-sm flex items-center justify-center gap-1'>
                    <Milk width={18} className='text-myBrown' />
                    Items
                </div>
            </div>
        </div>
    );
    // return (
    //     <div className='flex flex-col items-center'>
    //         <div className='text-5xl text-myBrown drop-shadow-sm'>0</div>
    //         <div className='flex gap-1 text-sm items-center'>
    //             <Milk width={18} className='text-myBrown' />
    //             Items
    //         </div>
    //     </div>
    // );
}

// Open/Pending cake orders for squarespace card
// function OpenCakeOrders() {
//     const [openCakeOrders, setOpenCakeOrders] = useState<number | undefined>();

//     useEffect(() => {
//         const getOpenSquarespaceCakeOrderCount = async () => {
//             try {
//                 const response = await fetch(
//                     'api/v1/squarespace-orders?fetch=cakes'
//                 );
//                 const result = await response.json();
//                 if (!response.ok) {
//                     throw new Error(result.error);
//                 }
//                 // console.log('openCakeOrders: ' + result.length);
//                 setOpenCakeOrders(result.length);
//             } catch (error) {
//                 const err = error as Error;
//                 console.log(err.message);
//                 setOpenCakeOrders(0);
//             }
//         };
//         getOpenSquarespaceCakeOrderCount();
//     }, []);

//     return (
//         <Card className='h-full shadow-md flex flex-col items-center relative'>
//             <CardHeader className='text-center'>
//                 <CardTitle className='font-normal'>Open Cake Orders</CardTitle>
//                 <CardDescription className='text-neutral-400 text-balance'>
//                     {`New cake orders made on AVA's website`}
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className='flex'>
//                 <p className='text-5xl text-myBrown drop-shadow-sm'>
//                     {openCakeOrders ?? '--'}
//                 </p>
//             </CardContent>
//             <Link
//                 href='/bakery/cake-orders'
//                 className='absolute right-2 bottom-2'
//             >
//                 {/* <Link href='/bakery/cake-orders' className='self-end'> */}
//                 <Button variant='ghost'>
//                     <ChevronRight className='h-2 w-2' />
//                 </Button>
//             </Link>
//         </Card>
//     );
// }

// function CarouselComponent() {
//     const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

//     return (
//         <Carousel className='h-full' plugins={[plugin.current]}>
//             <CarouselContent className='h-full'>
//                 <CarouselItem className='h-full'>
//                     <Card className='h-full'>
//                         <CardHeader>
//                             <CardTitle>Completed Orders</CardTitle>
//                             <CardDescription>{`Today's Completed Store Orders`}</CardDescription>
//                         </CardHeader>
//                         <CardContent className='flex-grow'>
//                             <p>Content</p>
//                             <p>Content</p>
//                         </CardContent>
//                         <CardFooter>
//                             <p>Footer</p>
//                         </CardFooter>
//                     </Card>
//                 </CarouselItem>
//                 <CarouselItem className='h-full'>
//                     <Card className='h-full'>
//                         <CardHeader>
//                             <CardTitle>Completed stock</CardTitle>
//                             <CardDescription>{`Today's Completed stock`}</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <p>Content</p>
//                         </CardContent>
//                         <CardFooter>
//                             <p>Footer</p>
//                         </CardFooter>
//                     </Card>
//                 </CarouselItem>
//             </CarouselContent>
//             {/* <CarouselPrevious/> */}
//             {/* <CarouselNext/> */}
//         </Carousel>
//     );
// }
