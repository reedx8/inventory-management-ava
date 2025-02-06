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
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from '@/components/ui/collapsible';
import {
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
// import { ChevronsUpDown } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// const formSchema = z.object({
//     itemName: z.string(),
//     count: z.string(),
// });

const formSchema = z.object({
    counts: z.record(z.string(), z.string()), // A record where keys are item names and values are counts
});

type MonThursStock = {
    itemName: string;
    units: string;
    count: number;
};

const dummyData: MonThursStock[] = [
    {
        itemName: 'Touchstone Whole',
        units: 'Per Gallon',
        count: 0,
    },
    {
        itemName: 'Touchstone 2%',
        units: 'Per Gallon',
        count: 0,
    },
    {
        itemName: 'Touchstone Fat-Free',
        units: 'Per Gallon',
        count: 0,
    },
    {
        itemName: 'Smith Brothers Half & Half',
        units: 'Per Quart',
        count: 0,
    },
    {
        itemName: 'Smith Brothers Heavy Whip',
        units: 'Per 1/2 Gallon',
        count: 0,
    },
    {
        itemName: 'PACIFIC ORIGINAL ALMOND MILK ',
        units: '12/32 oz',
        count: 0,
    },
    {
        itemName: 'PACIFIC SOY MILK',
        units: '12/32 oz',
        count: 0,
    },
    {
        itemName: 'PACIFIC COCONUT MILK',
        units: '12/32 oz',
        count: 0,
    },
    {
        itemName: 'PACIFIC OAT MILK',
        units: '12/32 oz',
        count: 0,
    },
    {
        itemName: 'Egg Nog',
        units: 'Per 1/2 Gallon',
        count: 0,
    },
];

export default function MondayThursSheet() {
    const [data, setData] = useState<MonThursStock[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [data, setData] = useState<MonThursStock[] | undefined>(dummyData);
    // const [isOpen, setIsOpen] = useState(false);

    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         itemName: '',
    //         count: '',
    //     },
    // });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            counts: dummyData.reduce((acc, item) => {
                acc[item.itemName] = ''; // Initialize with empty counts for each item
                return acc;
            }, {} as Record<string, string>),
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(values);
    }


    useEffect(() => {
        setData(dummyData);
        setIsLoading(false);
    }, []);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='myTheme'>Mon / Thurs Stock</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Monday Thursday Stock</SheetTitle>
                    <SheetDescription>
                        Perform stock counts on the following due items every Monday
                        and Thursday
                    </SheetDescription>
                    {/* <Collapsible className='border rounded-md p-2'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-sm text-neutral-500'>
                                Instructions
                            </h2>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='w-9 p-0'
                                >
                                    <ChevronsUpDown className='h-4 w-4' />
                                    <span className='sr-only'>Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className=' text-neutral-500'>
                            <div className='text-xs'>
                                {`15 minutes prior to close count all meat, please record how many boxes of 
                                    sealed item you have, count how many unopened sealed packs you have and 
                                    than all opened pre-portion meat must be weighted out on a scale.`}
                            </div>
                            <div className='text-xs mt-2'>
                                <span className='italic'>Example:</span>
                                {` One box of chicken and unopened bag - box goes under "Closed box" 
                                    column, unopened bag under "unopened pack" column and all other weigh on 
                                    scale and record under "weight on scale open items" - record the weight.`}
                            </div>
                        </CollapsibleContent>
                    </Collapsible> */}
                </SheetHeader>
                <Separator className='my-4' />
                {data === undefined && isLoading && (
                    <div className='flex flex-col w-[90%] gap-3'>
                        <div className='space-y-2'>
                            <Skeleton className='h-6 w-[100%] rounded-md' />
                            <Skeleton className='h-6 w-[100%] rounded-md' />
                            <Skeleton className='h-6 w-[80%] rounded-md' />
                            {/* <Skeleton className='h-4 w-[200px]' /> */}
                        </div>
                        {/* <Skeleton className='h-[175px] w-[100%] rounded-md' /> */}
                        <div className='flex gap-2 self-end'>
                            <Skeleton className='h-6 w-[75px] round-md' />
                            {/* <Skeleton className='h-6 w-[75px] round-md' /> */}
                        </div>
                    </div>
                    // <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                    // <p className='text-2xl text-gray-600'>Loading...</p>
                    // </div>
                )}
                {data && !isLoading && data?.length > 0 && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex flex-col space-y-3'
                        >
                            {data.map((item, key) => (
                                <FormField
                                    control={form.control}
                                    // name="count"
                                    name={`counts.${item.itemName}`}  // Dynamically set name
                                    key={key}
                                    render={({ field }) => (
                                        <FormItem className='flex justify-between items-center'>
                                            <FormLabel>{item.itemName} <span className='text-neutral-500'>({item.units})</span></FormLabel>
                                            <FormControl className='w-16 h-6'>
                                                <Input
                                                    placeholder='0'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Separator className='my-4' />
                            <Button type='submit' variant='myTheme'>Submit</Button>
                        </form>
                    </Form>
                )}
            </SheetContent>
        </Sheet>
    );
}
