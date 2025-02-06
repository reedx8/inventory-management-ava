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
import { ChevronsUpDown } from 'lucide-react';

export default function SundayCloseSheet() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='myTheme'>Sunday Close</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Sunday Close Stock</SheetTitle>
                    <SheetDescription>Perform stock counts on the following items at the end of every Sunday</SheetDescription>
                    <Collapsible className='border rounded-md p-2'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-sm text-neutral-500'>Instructions</h2>
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
            </SheetContent>
        </Sheet>
    );
}
