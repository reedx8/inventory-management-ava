'use client';
import React from 'react';
// import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
// import { useToast } from '@/hooks/use-toast';
// import { Separator } from '@/components/ui/separator';
// import { Input } from '@/components/ui/input';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
// import completePic from '/public/illustrations/complete.svg';
// import underConstructionPic from '/public/illustrations/underConstruction.svg';
// import { Label } from '@/components/ui/label';
// import { Loader2, Milk } from 'lucide-react';
import starPic from '/public/star.png';
import { SheetTemplateProps } from '@/components/types';


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

// type MilkBreadItems = {
//     id: number;
//     itemName: string;
//     nameFromVendor: string;
//     units: string;
//     count: number;
// };

const SheetTemplate = ({
    children,
    trigger,
    title,
    description,
    className,
    contentClassName,
    side = 'right',
    onOpenChange,
}: SheetTemplateProps) => {
    return (
        <Sheet onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>

            <SheetContent side={side} className={contentClassName}>
                {(title || description) && (
                    <SheetHeader>
                        {title && <SheetTitle>{title}</SheetTitle>}
                        {description && (
                            <SheetDescription>{description}</SheetDescription>
                        )}
                    </SheetHeader>
                )}
                <div className={className}>{children}</div>
                <Image
                    src={starPic}
                    alt='star'
                    width={200}
                    height={200}
                    style={{ width: '200px', height: '200px' }}
                    className='fixed bottom-[-30px] right-[-30px] opacity-30 z-[-1]'
                />
            </SheetContent>
        </Sheet>
    );
};

export default SheetTemplate;
