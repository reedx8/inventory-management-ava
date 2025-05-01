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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SheetTemplate = ({
    children,
    trigger,
    title,
    description,
    className,
    contentClassName,
    isCollapsible,
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
                            isCollapsible ? (
                                <Collapsible className='border rounded-md p-1 bg-neutral-100'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-sm text-neutral-500 flex items-center gap-1'>
                                        <Info size={16} />Instructions
                                    </h2>
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='w-7 p-0'
                                        >
                                            <ChevronsUpDown className='h-4 w-4' />
                                            <span className='sr-only'>Toggle</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className=' text-neutral-500'>
                                    <div className='text-xs'>
                                        {description}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>

                            ) : (
                            <SheetDescription>{description}</SheetDescription>
                            )
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
