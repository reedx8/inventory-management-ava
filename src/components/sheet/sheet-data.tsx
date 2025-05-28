import { useState, useEffect } from 'react';
// import StockItem from '@/app/(main)/store/stock/page';
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
import { ParsPayload, SheetDataType } from '@/components/types';
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
    const [placeholder] = useState<string>(() => {
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
    const [dowSelection, setDowSelection] = useState<string>('Monday');
    const [ todaysDow ] = useState<number>(new Date().getDay());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [refreshStockTrigger, setRefreshStockTrigger] = useState<number>(0); // only use for milk/bread
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // stop page from refreshing
        setFormFeedback(null);

        if (
            contentType === 'store:par' &&
            parCategory.toLowerCase() === 'pastry'
        ) {
            const updatedData = data.filter((item) => item.was_updated);
            if (updatedData.length === 0) {
                setFormFeedback('No changes to submit');
                return;
            }

            setIsSubmitting(true);

            const payload: ParsPayload = {
                data: updatedData,
                dow: dowSelection.toLowerCase(),
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
                setData((prev) =>
                    prev.map((item) => ({
                        ...item,
                        was_updated: false,
                    }))
                );

                // setData(data.map((item: SheetDataType) => ({
                //     ...item,
                //     was_updated: false,
                // })));

                toast({
                    title: 'PAR Levels Updated',
                    description:
                        'Pastry PAR levels have been updated successfully',
                    className: 'bg-myBrown border-none text-myDarkbrown',
                });
            } catch (error) {
                let errMsg;
                if (String(error).length > 100) {
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
        } else if (
            contentType === 'store:milk' ||
            contentType === 'store:bread'
        ) {
            try {
                setIsSubmitting(true);
                const response = await fetch(
                    `/api/v1/store-stock?stockType=milkBread&storeId=${storeId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.error);
                }

                toast({
                    title: 'Stock Updated',
                    description: 'Stock has been updated successfully',
                    className: 'bg-myBrown border-none text-myDarkbrown',
                });
            } catch (error) {
                let errMsg;
                if (String(error).length > 100) {
                    errMsg = String(error).slice(0, 100) + '...';
                } else {
                    errMsg = String(error);
                }
                toast({
                    title: 'Error Updating Stock',
                    description: errMsg,
                    variant: 'destructive',
                });
            }
            setRefreshStockTrigger((prev) => prev + 1);
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        const fetchMilkBreadStock = async () => {
            const store_id = storeId ? storeId : 0;
            let stockType = '';
            if (category.toLowerCase() === 'milk') {
                // only fetch milk on Mondays and Thursdays
                if (todaysDow !== 1 && todaysDow !== 4) {
                    setData([]);
                    return;
                }
                stockType = 'MILK';
            } else if (category.toLowerCase() === 'bread') {
                // only fetch bread on Mondays
                if (todaysDow !== 1) {
                    setData([]);
                    return;
                }
                stockType = 'BREAD';
            } else {
                setData([]);
                return;
            }

            setIsLoading(true);

            try {
                const response = await fetch(
                    `/api/v1/store-stock?stockType=${stockType}&storeId=${store_id}`
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error);
                }
                setData(data);
            } catch (error) {
                let errorMsg;
                if (String(error).length > 100) {
                    errorMsg = String(error).substring(0, 100) + '...';
                } else {
                    errorMsg = String(error);
                }
                // console.log('errorMsg: ', errorMsg);

                toast({
                    title: 'Error fetching milk & bread stock',
                    description: errorMsg,
                    variant: 'destructive',
                });
                setData([]);
            }
            setIsLoading(false);
        };

        const fetchDailyParLevels = async () => {
            setIsLoading(true);
            const store_id = storeId ? storeId : 0;
            try {
                // console.log(dowSelection);
                const response = await fetch(
                    `/api/v1/pars?storeId=${store_id}&dow=${dowSelection}&categ=${parCategory}`
                );
                const data = await response.json();

                if (!response.ok) {
                    // const msg = `Failed to fetch PAR levels`;
                    throw new Error(data.error);
                }

                setData(
                    data.map((item: SheetDataType) => ({
                        ...item,
                        was_updated: false,
                    }))
                );
            } catch (error) {
                let errMsg;
                if (String(error).length > 100) {
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

        if (
            contentType === 'store:par' &&
            parCategory.toLowerCase() === 'pastry'
        ) {
            fetchDailyParLevels();
        } else if (
            contentType === 'store:milk' ||
            contentType === 'store:bread'
        ) {
            // fetch milk or bread only on Mondays or Thursdays
            fetchMilkBreadStock();
        }
        setFormFeedback(null);
    }, [
        contentType,
        dowSelection,
        parCategory,
        storeId,
        toast,
        category,
        refreshStockTrigger,
        todaysDow,
    ]);

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
                    {contentType === 'store:par' &&
                        parCategory.toLowerCase() === 'pastry' && (
                            <Select
                                defaultValue='Monday'
                                onValueChange={(value) => {
                                    setDowSelection(value);
                                }}
                                disabled={isSubmitting || isLoading}
                            >
                                <SelectTrigger className='w-fit h-8 text-sm'>
                                    <SelectValue placeholder={dowSelection} />
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
                    {(contentType === 'store:milk' ||
                        contentType === 'store:bread') && (
                        <>
                            {category.toLowerCase() === 'milk' && (
                                <>
                                    <Image
                                        src={completePic}
                                        alt='complete'
                                        width={200}
                                        height={200}
                                    />
                                    <p className='text-md text-neutral-500'>
                                        No milk due!
                                    </p>
                                </>
                            )}
                            {category.toLowerCase() === 'bread' && (
                                <>
                                    <Image
                                        src={completePic}
                                        alt='complete'
                                        width={200}
                                        height={200}
                                    />
                                    <p className='text-md text-neutral-500'>
                                        No bread due!
                                    </p>
                                </>
                            )}
                        </>
                    )}
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
                                        <div>
                                            {item.name}
                                            {item.units && (
                                                <Badge
                                                    variant='outline'
                                                    className='text-xs ml-2 font-normal border-none text-black bg-gray-100'
                                                >
                                                    {item.units}
                                                </Badge>
                                            )}
                                        </div>
                                        <input
                                            name='count'
                                            type='number'
                                            id={item.id.toString()}
                                            className='w-16 rounded-sm border-2 h-8 pl-1'
                                            // defaultValue instead of value to avoid browser restricting submit on invalid input but valid field value, confusing UX
                                            defaultValue={
                                                item.qty === null
                                                    ? 0
                                                    : Number(
                                                          Number(
                                                              item.qty
                                                          ).toFixed(2)
                                                      )
                                            }
                                            placeholder='0'
                                            step={0.5}
                                            disabled={isSubmitting}
                                            autoComplete='off' // prevents auto-fill in most cases, which wont trigger onChange
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                setData((prev) =>
                                                    prev?.map((p) =>
                                                        p.id === item.id
                                                            ? {
                                                                  ...p,
                                                                  qty: Number(
                                                                      value
                                                                  ),
                                                                  was_updated:
                                                                      true,
                                                              }
                                                            : p
                                                    )
                                                );
                                            }}
                                            // onBlur just in case auto-fill still occurs in browser, isNaN check to prevent null object
                                            onBlur={(e) => {
                                                let value =
                                                    e.currentTarget.value;
                                                setData((prev) =>
                                                    prev?.map((p) =>
                                                        p.id === item.id
                                                            ? {
                                                                  ...p,
                                                                  qty: Number(
                                                                      value
                                                                  ),
                                                                  was_updated:
                                                                      true,
                                                              }
                                                            : p
                                                    )
                                                );
                                            }}
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
                                            // onWheel to prevent value from being changed by scrolling
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
