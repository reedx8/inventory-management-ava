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
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ParsPayload, SheetDataType2, StoreList, STORE_LIST } from '@/components/types';
import { useToast } from '@/hooks/use-toast';

type ContentType = 'pars:daily' | 'pars:weekly' | 'costunit';
type CategoryType = 'Milk' | 'Bread';


export default function SheetData({
    // storeId,
    contentType,
    setRefreshTrigger,
}: {
    // storeId: number;
    contentType: ContentType;
    setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [data, setData] = useState<SheetDataType2[]>([]);
    const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [category, setCategory] = useState<CategoryType>('Milk');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [store, setStore] = useState<{ id: number; name: StoreList }>({
        id: STORE_LIST[0].id,
        name: STORE_LIST[0].name,
    });
    // const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { toast } = useToast();

    const handleParSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // stop page from refreshing
        setFormFeedback(null);
        // console.log(data);
        // return;

        const updatedData = data.filter((item) => item.was_updated);
        if (updatedData.length === 0) {
            setFormFeedback('No changes to submit');
            return;
        }

        setIsSubmitting(true);

        const payload: ParsPayload = {
            data: updatedData,
            dow: 'weekly',
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

            toast({
                title: 'PAR Levels Updated',
                description: 'PAR levels have been updated successfully',
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

        setIsSubmitting(false);
        setRefreshTrigger((prev) => prev + 1);
    };

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
        const fetchParLevels = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/api/v1/pars?storeId=${store.id}&dow=weekly&categ=${category.toUpperCase()}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                // setData(data); // data is already in the correct format (including was_updated = false)
                setData(
                    data.map((item: SheetDataType2) => ({
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

        const fetchCostUnit = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/api/v1/items?fetch=costunit`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                // setData(data); // data is already in the correct format (including was_updated = false)
                setData(
                    data.map((item: SheetDataType2) => ({
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

        if (contentType === 'pars:daily' || contentType === 'pars:weekly') {
            fetchParLevels();
        } else if (contentType === 'costunit') {
            fetchCostUnit();
        }

        setFormFeedback(null);
    }, [
        contentType,
        category,
        store,
    ]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex text-sm gap-2 self-end'>
                <Select
                    defaultValue={store.name}
                    onValueChange={(value) => {
                        setStore({
                            id: STORE_LIST.find((s) => s.name === value)
                                ?.id as number ?? 0,
                            name: value as StoreList,
                        });
                    }}
                    disabled={isSubmitting || isLoading}
                >
                    <SelectTrigger className='w-fit h-8 text-sm'>
                        <SelectValue placeholder={store.name} />
                    </SelectTrigger>
                    <SelectContent>
                        {STORE_LIST.map((store) => (
                            <SelectItem
                                key={store.id}
                                className='h-8 text-sm'
                                value={store.name}
                            >
                                {store.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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
                        onSubmit={
                            contentType === 'pars:daily' ||
                            contentType === 'pars:weekly'
                                ? handleParSubmit
                                : handleCostUnitSubmit
                        }
                    >
                        <ScrollArea className='max-h-[60vh] overflow-y-auto'>
                            <div className='grid grid-cols-1 gap-1'>
                                {data.map((item) => (
                                    <div
                                        key={item.item_id}
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
                                            id={item.item_id.toString()}
                                            className='w-16 rounded-sm border-2 h-8 pl-1'
                                            defaultValue={
                                                item.qty === null
                                                    ? 0
                                                    : Number(
                                                          Number(
                                                              item.qty
                                                          ).toFixed(2)
                                                      )
                                            }
                                            // value={item.level ?? 0}
                                            placeholder='0'
                                            step={0.5}
                                            disabled={isSubmitting}
                                            onChange={(e) => {
                                                setData((prev) =>
                                                    prev?.map((p) =>
                                                        p.item_id ===
                                                        item.item_id
                                                            ? {
                                                                  ...p,
                                                                  qty: Number(
                                                                      e.target
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
