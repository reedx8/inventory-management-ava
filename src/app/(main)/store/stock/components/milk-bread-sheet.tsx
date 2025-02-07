'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from '@/components/ui/collapsible';
// import {
//     Form,
//     FormControl,
//     // FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import completePic from '/public/illustrations/complete.svg';
import underConstructionPic from '/public/illustrations/underConstruction.svg';
import { Label } from '@/components/ui/label';
import { Loader2, Milk } from 'lucide-react';
import starPic from '/public/star.png';
// import { set } from 'zod';
// import { Controller } from 'react-hook-form';
// import { count } from 'console';

// const formSchema = z.object({
//     items: z.record(z.string())
// });

type MilkBreadItems = {
    id: number;
    itemName: string;
    nameFromVendor: string;
    units: string;
    count: number;
};

// const dummyData: MonThursStock[] = [
//     {
//         itemName: 'Touchstone Whole',
//         units: 'Per Gallon',
//         count: 0,
//     },
//     {
//         itemName: 'Touchstone 2%',
//         units: 'Per Gallon',
//         count: 0,
//     },
//     {
//         itemName: 'Touchstone Fat-Free',
//         units: 'Per Gallon',
//         count: 0,
//     },
//     {
//         itemName: 'Smith Brothers Half & Half',
//         units: 'Per Quart',
//         count: 0,
//     },
//     {
//         itemName: 'Smith Brothers Heavy Whip',
//         units: 'Per 1/2 Gallon',
//         count: 0,
//     },
//     {
//         itemName: 'PACIFIC ORIGINAL ALMOND MILK ',
//         units: '12/32 oz',
//         count: 0,
//     },
//     {
//         itemName: 'PACIFIC SOY MILK',
//         units: '12/32 oz',
//         count: 0,
//     },
//     {
//         itemName: 'PACIFIC COCONUT MILK',
//         units: '12/32 oz',
//         count: 0,
//     },
//     {
//         itemName: 'PACIFIC OAT MILK',
//         units: '12/32 oz',
//         count: 0,
//     },
//     {
//         itemName: 'Egg Nog',
//         units: 'Per 1/2 Gallon',
//         count: 0,
//     },
// ];

export default function MilkBreadSheet() {
    const [data, setData] = useState<MilkBreadItems[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { userRole, userStoreId } = useAuth();
    const [itemCounts, setItemCounts] = useState<{ [key: number]: number }>({});
    const [error, setError] = useState(null); // State for tracking errors
    const { toast } = useToast();

    // Handler to update count for a specific item
    const handleCountChange = (itemId: number, newCount: string) => {
        const count = Math.max(0, parseInt(newCount) || 0);
        setItemCounts((prev) => ({
            ...prev,
            [itemId]: count,
        }));
    };

    // const [data, setData] = useState<MonThursStock[] | undefined>(dummyData);
    // const [isOpen, setIsOpen] = useState(false);

    // const form = useForm({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         items: data
    //             ? data.reduce((acc, item) => {
    //                 acc[item.id] = String(item.count); // Convert initial count to string
    //                 return acc;
    //             }, {})
    //             : {},
    //     },
    // });

    // function onSubmit(values: z.infer<typeof formSchema>) {
    //     // Do something with the form values.
    //     console.log(values);
    // }

    async function getMilkBread() {
        try {
            const res = await fetch(
                `/api/v1/store-stock?stockType=milkBread&storeId=${userStoreId}`
            );

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setData(data);

            // Initialize itemCounts with 0 for each item
            const initialCounts = data.reduce((acc, item) => {
                acc[item.id] = 0; // Set initial value to 0 for each item
                return acc;
            }, {});
            setItemCounts(initialCounts);

            setError(null);
        } catch (error) {
            console.error('Failed to fetch stock data: ', error);
            setData([]);
            setError(error.message);
            toast({
                title: 'Error',
                description: 'Failed to fetch stock data',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `/api/v1/store-stock?stockType=milkBread&storeId=${userStoreId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        storeId: userStoreId,
                        items: Object.entries(itemCounts).map(
                            ([id, count]) => ({
                                itemId: Number(id),
                                count,
                            })
                        ),
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'Failed to submit item(s)');

            // Clear counts after successful submission
            // setItemCounts({});
            // setError(null);
            toast({
                title: 'Submitted!',
                description: 'Stock counts submitted successfully',
                className: 'border shadow-lg',
            });

            // Refresh view after successful submission
            await getMilkBread();
        } catch (error) {
            // console.error('Error submitting counts:', error);
            // console.log('error: ', error);
            setError(error.message);
            toast({
                title: 'Submission Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (userRole !== 'store_manager') {
            setData([]);
            setIsLoading(false);
        } else {
            getMilkBread();
        }
        // getMilkBread();

        // test:
        // setData(dummyData);
        // setIsLoading(false);
    }, [userRole, userStoreId]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='myTheme'><Milk className='h-4 w-4'/> Milk / Bread</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='text-xl'>
                        Milk & Bread Stock
                    </SheetTitle>
                    <SheetDescription>
                        Perform stock counts on the following milk and bread
                        items every Monday and Thursday
                    </SheetDescription>
                </SheetHeader>
                <Separator className='my-4' />
                {data === undefined && isLoading && (
                    <div className='flex flex-col w-[90%] gap-3'>
                        <div className='space-y-2'>
                            <Skeleton className='h-8 w-[100%] rounded-md' />
                            <Skeleton className='h-8 w-[80%] rounded-md' />
                            <Skeleton className='h-8 w-[60%] rounded-md' />
                            {/* <Skeleton className='h-4 w-[200px]' /> */}
                        </div>
                        {/* <Skeleton className='h-[175px] w-[100%] rounded-md' /> */}
                        <div className='flex gap-2 self-end'>
                            <Skeleton className='h-8 w-[75px] round-md' />
                            {/* <Skeleton className='h-6 w-[75px] round-md' /> */}
                        </div>
                    </div>
                    // <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                    // <p className='text-2xl text-gray-600'>Loading...</p>
                    // </div>
                )}
                {data &&
                    !isLoading &&
                    data?.length === 0 &&
                    userRole === 'store_manager' && (
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <Image
                                src={completePic}
                                alt='complete'
                                width={200}
                                height={200}
                            />
                            <p className='text-md text-gray-600'>
                                No milk or bread due!
                            </p>
                        </div>
                    )}
                {data &&
                    !isLoading &&
                    data?.length === 0 &&
                    userRole === 'admin' && (
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <Image
                                src={underConstructionPic}
                                alt='complete'
                                width={200}
                                height={200}
                            />
                            Admin view under construction
                        </div>
                    )}
                {data && !isLoading && data?.length > 0 && (
                    <div className='flex flex-col space-y-3'>
                        {data.map((item) => (
                            <div
                                key={item.id.toString()}
                                className='flex justify-between items-center'
                            >
                                <Label htmlFor={item.id.toString()}>
                                    {item.itemName}
                                    <span className='text-neutral-500 text-xs'>
                                        {' '}
                                        ({item.units})
                                    </span>
                                </Label>
                                <Input
                                    type='number'
                                    disabled={isSubmitting}
                                    id={item.id.toString()}
                                    value={itemCounts[item.id] ?? 0}
                                    className='w-24 h-8'
                                    onChange={
                                        (e) =>
                                            handleCountChange(
                                                item.id,
                                                e.target.value
                                            )
                                        // console.log(e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            variant='myTheme'
                            disabled={isSubmitting}
                            className='z-1000'
                        >
                            {isSubmitting && (
                                <Loader2 className='mr-2 animate-spin' />
                            )}
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                            {/* Submit */}
                        </Button>
                    </div>
                )}
                <Image
                    src={starPic}
                    alt='star'
                    width={200}
                    height={200}
                    className='fixed bottom-[-30px] right-[-30px] opacity-30 z-[-1]'
                />
            </SheetContent>
        </Sheet>
    );
}

{
    /*
                    // <Form {...form}>
                    //     <form
                    //         onSubmit={form.handleSubmit(onSubmit)}
                    //         className='flex flex-col space-y-3'
                    //     >
                    //         {data.map((item) => (
                    //             <FormField
                    //                 control={form.control}
                    //                 // name="count"
                    //                 name={`items.${item.id}`} // Dynamically set name
                    //                 key={item.id}
                    //                 render={({ field }) => (
                    //                     <FormItem className='flex justify-between items-center'>
                    //                         <FormLabel>
                    //                             {item.itemName}{' '}
                    //                             <span className='text-neutral-500'>
                    //                                 ({item.units})
                    //                             </span>
                    //                         </FormLabel>
                    //                         <FormControl className='w-16 h-6'>
                    //                             <Input
                    //                                 type="text"
                    //                                 placeholder='0'
                    //                                 // value={{item.count}}
                    //                                 {...field}
                    //                             />
                    //                         </FormControl>
                    //                         <FormMessage />
                    //                     </FormItem>
                    //                 )}
                    //             />
                    //         ))}
                    //         <Separator className='my-4' />
                    //         <Button type='submit' variant='myTheme'>
                    //             Submit
                    //         </Button>
                    //     </form>
                    // </Form>
*/
}
