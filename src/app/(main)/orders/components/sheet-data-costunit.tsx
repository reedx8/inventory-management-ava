import { useState, useEffect } from 'react';
// import StockItem from '@/app/(main)/store/stock/page';
import Image from 'next/image';
import completePic from '/public/illustrations/complete.svg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CircleOff, DollarSign, Send } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
// import { ParsPayload, } from '@/components/types';
import { useToast } from '@/hooks/use-toast';

type ContentType = 'costunit';
type CategoryType = 'Milk' | 'Bread';

export type SheetDataTypeCU = {
    vendor_item_id: number;
    alt_name: string;
    units: string;
    cost_unit: number;
    was_updated: boolean;
};

export default function SheetDataCostUnit({
    // storeId,
    contentType,
    setRefreshTrigger,
}: {
    // storeId: number;
    contentType: ContentType;
    setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [data, setData] = useState<SheetDataTypeCU[]>([]);
    const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [category, setCategory] = useState<CategoryType>('Milk');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleCostUnitSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault(); // stop page from refreshing
        setFormFeedback(null);

        const updatedData = data.filter((item) => item.was_updated);
        if (updatedData.length === 0) {
            setFormFeedback('No changes to submit');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/items?update=costunit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
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

            toast({
                title: 'Cost/Unit Updated',
                description: 'Cost/Unit has been updated successfully',
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
                title: 'Error Updating Cost/Unit',
                description: errMsg,
                variant: 'destructive',
            });
        }

        setIsSubmitting(false);
        setRefreshTrigger((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchCostUnit = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/api/v1/items?fetch=costunit&categ=${category.toUpperCase()}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                // setData(data); // data is already in the correct format (including was_updated = false)
                setData(
                    data.map((item: SheetDataTypeCU) => ({
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
                    title: 'Error Fetching Cost/Unit',
                    description: errMsg,
                    variant: 'destructive',
                });
                setData([]);
            }
            setIsLoading(false);
            // console.log(data);
        };

        fetchCostUnit();

        setFormFeedback(null);
    }, [
        // contentType,
        category,
    ]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex text-sm self-end'>
                <Select
                    defaultValue={category}
                    onValueChange={(value) => {
                        setCategory(value as CategoryType);
                    }}
                    disabled={isSubmitting || isLoading}
                >
                    <SelectTrigger className='w-fit h-8 text-sm'>
                        <SelectValue placeholder={category} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem className='h-8 text-sm' value='Milk'>
                            Milk
                        </SelectItem>
                        <SelectItem className='h-8 text-sm' value='Bread'>
                            Bread
                        </SelectItem>
                    </SelectContent>
                </Select>
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
                    <CircleOff className='w-8 h-8 text-neutral-500' />
                    <p className='text-md text-neutral-500'>No data found</p>
                </div>
            )}
            {!isLoading && data && data.length > 0 && (
                <div className='mt-1'>
                    <form
                        className='flex flex-col gap-2'
                        onSubmit={handleCostUnitSubmit}
                    >
                        <ScrollArea className='max-h-[60vh] overflow-y-auto'>
                            <div className='grid grid-cols-1 gap-1'>
                                {data.map((item) => (
                                    <div
                                        key={item.vendor_item_id}
                                        className='flex justify-between h-fit items-center mt-1 text-sm'
                                    >
                                        <div>
                                            {item.alt_name}
                                            {item.units && (
                                                <Badge
                                                    variant='outline'
                                                    className='text-xs ml-2 font-normal border-none text-black bg-gray-100'
                                                >
                                                    {item.units}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <DollarSign className='w-3 h-3 text-myDarkbrown' />
                                            <input
                                                name='count'
                                                type='number'
                                                id={item.vendor_item_id.toString()}
                                                className='w-20 rounded-sm border-2 h-8 pl-1'
                                                defaultValue={
                                                    item.cost_unit === null
                                                        ? 0
                                                        : Number(
                                                              item.cost_unit
                                                          ).toFixed(2)
                                                }
                                                // value={item.level ?? 0}
                                                placeholder='0'
                                                step='any'
                                                disabled={isSubmitting}
                                                autoComplete='off'
                                                onChange={(e) => {
                                                    setData((prev) =>
                                                        prev?.map((p) =>
                                                            p.vendor_item_id ===
                                                            item.vendor_item_id
                                                                ? {
                                                                      ...p,
                                                                      cost_unit:
                                                                          Number(
                                                                              e
                                                                                  .target
                                                                                  .value
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
                                                onWheel={(e) =>
                                                    e.currentTarget.blur()
                                                }
                                            />
                                        </div>
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
