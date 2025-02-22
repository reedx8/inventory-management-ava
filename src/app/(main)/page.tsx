'use client'; // needed for Autoplay
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Separator } from "@/components/ui/separator"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import {
    ChevronRight,
    CalendarDays,
    Box,
    Cake,
    ChevronDown,
    Store,
} from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HeaderBar, todaysDay } from '@/components/header-bar';
import { title } from 'process';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const orderSchedule = [
    {
        day: 'Monday',
        itemsDue: 'Pastries',
    },
    {
        day: 'Tuesday',
        itemsDue: 'Pastries, Reguler Weekly Orders',
    },
    {
        day: 'Wednesday',
        itemsDue: 'Pastries, CTC Weekly Orders',
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
];

export default function Home() {
    const [bakeryDueTodayCount, setBakeryDueTodayCount] = useState<
        number | null
    >(null);
    const [itemCount, setItemCount] = useState<number | undefined>();
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const todaysDate : string = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const getBakeryDueTodayCounts = async () => {
            try {
                const response = await fetch(
                    `api/v1/dashboard?fetch=bakeryDueToday`
                );
                let result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error);
                }
                // console.log('success');
                setBakeryDueTodayCount(result.data[0].count);
            } catch (error) {
                const err = error as Error;
                console.log(err);
                setBakeryDueTodayCount(0);
            }
            // setIsLoading(false);
        };
        const getItemCount = async () => {
            try {
                const response = await fetch(
                    'api/v1/dashboard?fetch=itemCount'
                );
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error);
                }
                setItemCount(result.data[0].count);
            } catch (error) {
                const err = error as Error;
                console.log(err.message);
                setItemCount(0);
            }
        };
        getBakeryDueTodayCounts();
        getItemCount();
    }, []);
    // console.log(dueTodayCount)
    // console.log(bakeryDueTodayCount);
    // console.log(today);

    return (
        <main>
            <HeaderBar pageName={'Home'} />
            <section className='flex justify-between items-center rounded-xl shadow-md border bg-white p-4 mt-2 text-black/80'>
                <div>
                    <h2 className='text-md'>
                        Inventory Management System{' '}
                        <span className='text-neutral-400 text-sm'>(IMS)</span>
                    </h2>
                </div>
                <div className='flex flex-col items-end'>
                    <h2 className='flex items-center'>
                        <Store width={17} className='mr-1 text-myBrown' /> Store
                        Locations: <span className='ml-1 text-lg'>4</span>
                    </h2>
                    <h2 className='flex items-center'>
                        <Box width={17} className='mr-1 text-myBrown' />
                        Item Count:
                        <span className='ml-1 text-lg'>
                            {itemCount ? itemCount : '--'}
                        </span>
                    </h2>
                </div>
            </section>
            <section className='flex flex-col gap-2 mt-4'>
                <h2 className='text-2xl flex'>Due Today {scheduleBtn()}</h2>
                <div className='flex flex-wrap gap-3 sm:grid sm:grid-cols-[auto_1fr] sm:gap-3'>
                    <Card className='h-full shadow-md flex flex-col items-center min-w-[250px]'>
                        <CardHeader className='text-center'>
                            <CardTitle className='font-normal'>
                                Orders
                            </CardTitle>
                            <CardDescription className='text-neutral-400 text-balance'>
                                Item Orders Due Today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {miniOrderCards(bakeryDueTodayCount)}
                        </CardContent>
                    </Card>
                    <Card className='h-full shadow-md flex flex-col items-center'>
                        <CardHeader className='text-center'>
                            <CardTitle className='font-normal'>
                                Stock Counts
                            </CardTitle>
                            <CardDescription className='text-neutral-400 text-balance'>
                                Stock Counts Due Today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>{miniStockCards()}</CardContent>
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
                    <Tabs className='text-xs'>
                        <TabsList>
                            <TabsTrigger value='orders'>Orders</TabsTrigger>
                            <TabsTrigger value='stock'>Stock</TabsTrigger>
                        </TabsList>
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
            name: 'Bakery',
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
                            {type.count !== null ? type.count : '--'}
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
function miniStockCards() {
    return (
        <div className='flex flex-col items-center'>
            <div className='text-5xl text-myBrown drop-shadow-sm'>0</div>
            <div className='flex gap-1 text-sm items-center'>
                <Box width={18} className='text-myBrown' />
                Items
            </div>
        </div>
    );
}

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
