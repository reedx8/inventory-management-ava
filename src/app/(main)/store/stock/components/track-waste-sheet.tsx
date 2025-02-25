'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Separator } from "@/components/ui/separator"
import { ChevronsUpDown, Trash } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import starPic from '/public/star.png';
import Image from 'next/image';
import { SendHorizontal } from 'lucide-react';

const formSchema = z.object({
    itemName: z.string(),
    count: z.number(),
});

export default function TrackWasteSheet() {
    // const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itemName: '',
            count: 0,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(values);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='myTheme3'><Trash className='h-4 w-4'/> Track Waste</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='text-xl'>Track Inventory Waste</SheetTitle>
                    <SheetDescription>
                        Perform stock counts on the following items at the end
                        of every Sunday to track waste of our inventory
                    </SheetDescription>
                    <Collapsible className='border rounded-md p-2'>
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
                    </Collapsible>
                </SheetHeader>
                <Separator className='my-4'/>
                {/* <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <FormField
                            control={form.control}
                            name='count'
                            render={({ field }) => (
                                <FormItem className='flex justify-between items-center'>
                                    <FormLabel>Sesame Bagel</FormLabel>
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
                        <Button type='submit'>Submit <SendHorizontal className='ml-2 h-4 w-4'/></Button>
                    </form>
                </Form> */}
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
