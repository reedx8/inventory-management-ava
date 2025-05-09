import { useState, useEffect } from 'react';
import StockItem from '@/app/(main)/store/stock/page';
import Image from 'next/image';
import completePic from '/public/illustrations/complete.svg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CircleOff, Send } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { SheetDataType } from '@/components/types';
import { useToast } from '@/hooks/use-toast';

type ContentType = 'store:milk' | 'store:bread' | 'store:par' | 'bakery:orders';

export default function SheetData({
    storeId,
    contentType,
}: {
    storeId: number;
    contentType: ContentType;
}) {
    const [data, setData] = useState<SheetDataType[]>([]);
    const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [parCategory, setParCategory] = useState<string>('Pastry');
    const [category, setCategory] = useState<string>('Milk');
    const [placeholder, setPlaceholder] = useState<string>(() => {
        if (contentType === 'store:par') {
            return parCategory;
        } else if (
            contentType === 'store:milk' ||
            contentType === 'store:bread'
        ) {
            return category;
        } else {
            return '';
        }
    });
    const [dow, setDow] = useState<string>('Monday');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // stop page from refreshing
        setFormFeedback(null);
        // console.log(data);

        if (
            (contentType === 'store:milk' || contentType === 'store:bread') &&
            data?.some((item) => item.qty === null)
        ) {
            setFormFeedback('Please fill in all fields before submitting');
            return;
        }

        if (contentType === 'store:par' && parCategory.toLowerCase() === 'pastry') {
            const updatedData = data.filter((item) => item.was_updated);
            if (updatedData.length === 0) {
                setFormFeedback('No changes to submit');
                return;
            }

            setIsSubmitting(true);

            const payload = {
                data: updatedData,
                dow: dow.toLowerCase(),
            };

            try {
                const response = await fetch('/api/v1/pars', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }
                setData((prev) => prev.map((item) => ({
                    ...item,
                    was_updated: false,
                })));

                // setData(data.map((item: SheetDataType) => ({
                //     ...item,
                //     was_updated: false,
                // })));

                toast({
                    title: 'PAR Levels Updated',
                    description: 'Pastry PAR levels have been updated successfully',
                    className: 'bg-myBrown border-none text-myDarkbrown',
                });
            } catch (error) {
                let errMsg;
                if (String(error).length > 100){
                    errMsg = String(error).slice(0, 100) + '...';
                } else {
                    errMsg = String(error);
                }
                toast({
                    title: 'Error Updating PAR Levels',
                    description: errMsg,
                    variant: 'destructive',
                });
            }
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        const fetchDailyParLevels = async () => {
            setIsLoading(true);
            const storeid = storeId ? storeId : 0;
            try {
                // console.log(dow);
                const response = await fetch(
                    `/api/v1/pars?storeId=${storeId}&dow=${dow}&categ=${parCategory}`
                );
                const data = await response.json();

                if (!response.ok) {
                    // const msg = `Failed to fetch PAR levels`;
                    throw new Error(data.error);
                }

                setData(data.map((item: SheetDataType) => ({
                    ...item,
                    was_updated: false,
                })));
            } catch (error) {
                let errMsg;
                if (String(error).length > 100){
                    errMsg = String(error).slice(0, 100) + '...';
                } else {
                    errMsg = String(error);
                }
                toast({
                    title: 'Error Fetching PAR Levels',
                    description: errMsg,
                    variant: 'destructive',
                });
                setData([]);
            }
            setIsLoading(false);
            // console.log(data);
        };

        if (contentType === 'store:par' && parCategory.toLowerCase() === 'pastry') {
            fetchDailyParLevels();
        } else if (
            contentType === 'store:milk' ||
            contentType === 'store:bread'
        ) {
            // fetch milk or bread values here
            console.log('milk or bread');
        }
        setFormFeedback(null);
    }, [contentType, dow, parCategory, storeId]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between items-center mt-2'>
                <div>
                    {data && data.length > 0 && (
                        <Badge
                            variant='default'
                            className='text-xs bg-myBrown text-myDarkbrown hover:bg-myBrown'
                        >
                            {data[0].store_name}
                        </Badge>
                    )}
                </div>
                <div className='flex text-sm gap-2 self-end'>
                    {contentType === 'store:par' && parCategory.toLowerCase() === 'pastry' && (
                        <Select
                            defaultValue='Monday'
                            onValueChange={(value) => {
                                setDow(value);
                            }}
                            disabled={isSubmitting || isLoading}
                        >
                            <SelectTrigger className='w-fit h-8 text-sm'>
                                <SelectValue placeholder={dow} />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    'Monday',
                                    'Tuesday',
                                    'Wednesday',
                                    'Thursday',
                                    'Friday',
                                    'Saturday',
                                    'Sunday',
                                ].map((day) => (
                                    <SelectItem
                                        className='h-8 text-sm'
                                        value={day}
                                        key={day}
                                    >
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select
                        defaultValue={placeholder}
                        onValueChange={(value) => {
                            if (contentType === 'store:par') {
                                setParCategory(value);
                            } else if (
                                contentType === 'store:milk' ||
                                contentType === 'store:bread'
                            ) {
                                setCategory(value);
                            }
                        }}
                        disabled={isSubmitting || isLoading}
                    >
                        <SelectTrigger className='w-fit h-8 text-sm'>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {contentType === 'store:par' && (
                                <>
                                    <SelectItem
                                        className='h-8 text-sm'
                                        value='Pastry'
                                    >
                                        Pastries
                                    </SelectItem>
                                    {/* <SelectItem
                                        className='h-8 text-sm'
                                        value='MilkBread'
                                    >
                                        Milk & Bread
                                    </SelectItem> */}
                                </>
                            )}
                            {(contentType === 'store:milk' ||
                                contentType === 'store:bread') && (
                                <>
                                    <SelectItem
                                        className='h-8 text-sm'
                                        value='Milk'
                                    >
                                        Milk
                                    </SelectItem>
                                    <SelectItem
                                        className='h-8 text-sm'
                                        value='Bread'
                                    >
                                        Bread
                                    </SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {isLoading && (
                <div className='flex flex-col gap-2 mt-4'>
                    <Skeleton className='h-5 w-full' />
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-5 w-1/4' />
                    <Skeleton className='h-12 w-full' />
                </div>
            )}
            {!isLoading && data && data.length === 0 && (
                <div className='flex flex-col items-center justify-center gap-2 mt-4'>
                    {contentType === 'store:milk' ||
                        (contentType === 'store:bread' && (
                            <>
                                <Image
                                    src={completePic}
                                    alt='complete'
                                    width={200}
                                    height={200}
                                />
                                <p className='text-md text-neutral-500'>
                                    No milk or bread due!
                                </p>
                            </>
                        ))}
                    {contentType === 'store:par' && (
                        <>
                            <CircleOff className='w-8 h-8 text-neutral-500' />
                            <p className='text-md text-neutral-500'>
                                No PAR levels found
                            </p>
                        </>
                    )}
                </div>
            )}
            {!isLoading && data && data.length > 0 && (
                <div className='mt-1'>
                    <form
                        className='flex flex-col gap-2'
                        onSubmit={handleSubmit}
                    >
                        <ScrollArea className='max-h-[60vh] overflow-y-auto'>
                            <div className='grid grid-cols-1 gap-1'>
                                {data.map((item) => (
                                    <div
                                        key={item.id}
                                        className='flex justify-between h-fit items-center mt-1 text-sm'
                                    >
                                        <p>{item.name}</p>
                                        <input
                                            name='count'
                                            type='number'
                                            id={item.id.toString()}
                                            className='w-16 rounded-sm border-2 h-8 pl-1'
                                            defaultValue={item.qty === null ? 0 : Number(Number(item.qty).toFixed(1))}
                                            // value={item.level ?? 0}
                                            placeholder='0'
                                            step={0.5}
                                            disabled={isSubmitting}
                                            onChange={(e) => {
                                                setData((prev) =>
                                                    prev?.map((p) =>
                                                        p.id === item.id
                                                            ? {
                                                                  ...p,
                                                                  qty: Number(
                                                                      e.target
                                                                          .value
                                                                  ),
                                                                  was_updated: true,
                                                              }
                                                            : p
                                                    )
                                                );
                                            }}
                                            //                       ...p,
                                            //                       count: Number(
                                            //                           e.target
                                            //                               .value
                                            //                       ),
                                            //                   }
                                            //                 : p
                                            //         )
                                            //     )
                                            // }
                                            // onFocus and onClick allows consistent selection of all text in input field
                                            onFocus={(e) => {
                                                setTimeout(() => {
                                                    e.target.select();
                                                }, 0);
                                            }}
                                            onClick={(e) =>
                                                (
                                                    e.target as HTMLInputElement
                                                ).select()
                                            }
                                            onWheel={(e) =>
                                                e.currentTarget.blur()
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className='flex flex-col gap-1 w-full'>
                            <SubmitButton
                                idleText='Submit'
                                loadingText='Submitting...'
                                isSubmitting={isSubmitting}
                            />
                            {formFeedback && (
                                <div className='flex justify-center'>
                                    <p className='text-red-500 text-sm'>
                                        {formFeedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
function SubmitButton({
    idleText,
    loadingText,
    isSubmitting,
}: {
    idleText: string;
    loadingText: string;
    isSubmitting: boolean;
}) {
    const { pending } = useFormStatus();

    return (
        <>
            <Button
                type='submit'
                className='h-12 text-md flex items-center w-full'
                variant='myTheme'
                disabled={isSubmitting}
            >
                <Send /> {pending ? loadingText : idleText}
            </Button>
        </>
    );
}
