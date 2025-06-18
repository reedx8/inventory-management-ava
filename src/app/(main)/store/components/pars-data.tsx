import { useState, useEffect } from 'react';
// import StockItem from '@/app/(main)/store/stock/page';
// import Image from 'next/image';
// import completePic from '/public/illustrations/complete.svg';
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
import { ParsPayload, SheetDataType, SheetDataType2 } from '@/components/types';
import { useToast } from '@/hooks/use-toast';
import { STORE_LIST, StoreList } from '@/components/types';

// type ContentType = 'store:milk' | 'store:bread' | 'store:par' | 'bakery:orders';

// Used for edit pars btn on stores page (wrap component in Sheet Template component)
export default function ParsData({
    storeId,
    role,
    setRefreshParent,
}: {
    storeId: number;
    role: string;
    setRefreshParent: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [data, setData] = useState<SheetDataType2[]>([]);
    const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [parCategory, setParCategory] = useState<string>('Pastry'); // Pastry, CTC, and CCP&SYSCO (items.cron_categ)
    const [dowSelection, setDowSelection] = useState<string>('Monday');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [adminStoreId, setAdminStoreId] = useState<number>(STORE_LIST[0].id);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // stop page from refreshing
        setFormFeedback(null);

        // check if any items were updated first:
        const updatedData = data.filter((item) => item.was_updated);
        if (updatedData.length === 0) {
            setFormFeedback('No changes to submit');
            return;
        }

        setIsSubmitting(true);

        let dowSelect = dowSelection.toLowerCase();
        if (parCategory.toLowerCase() !== 'pastry') {
            dowSelect = 'weekly';
        }

        const payload: ParsPayload = {
            data: updatedData,
            dow: dowSelect,
            // dow: dowSelection.toLowerCase(),
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
                description: `${parCategory} PAR levels have been updated successfully`,
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

        setRefreshParent((prev) => prev + 1);

        setIsSubmitting(false);
    };

    useEffect(() => {
        // fetch item's daily or weekly par levels depending on its category and current store
        const fetchParLevels = async () => {
            setIsLoading(true);
            const store_id = storeId ? storeId : 0;
            try {
                let dowSelect = dowSelection;
                if (parCategory.toLowerCase() !== 'pastry') {
                    dowSelect = 'weekly';
                }

                // Need this to handle '&' correctly when parCategory='CCP&SYSCO':
                const itemCateg = encodeURIComponent(parCategory);

                const currStoreId = role === 'admin' ? adminStoreId : store_id;

                const response = await fetch(
                    `/api/v1/pars?storeId=${currStoreId}&dow=${dowSelect}&categ=${itemCateg}`
                    // `/api/v1/pars?storeId=${store_id}&dow=${dowSelect}&categ=${itemCateg}`
                    // `/api/v1/pars?storeId=${store_id}&dow=${dowSelect}&categ=${parCategory}`
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

        fetchParLevels();

        setFormFeedback(null);
    }, [dowSelection, parCategory, storeId, toast, adminStoreId, role]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between items-center mt-2'>
                <div>
                    {role === 'admin' ? (
                        <Badge variant='default' className='text-xs bg-myBrown text-myDarkbrown hover:bg-myBrown'>
                            <Select
                                defaultValue={adminStoreId.toString()}
                                onValueChange={(value) =>
                                    setAdminStoreId(Number(value))
                                }
                                disabled={isSubmitting || isLoading}
                            >
                                <SelectTrigger className='w-fit h-6 text-xs bg-myBrown outline-none border-none'>
                                    <SelectValue
                                        placeholder={
                                            STORE_LIST.find(
                                                (store) =>
                                                    store.id === adminStoreId
                                            )?.name
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {STORE_LIST.map((store) => (
                                        <SelectItem
                                            key={store.id}
                                            value={store.id.toString()}
                                        >
                                            {store.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Badge>
                    ) : (
                        data &&
                        data.length > 0 && (
                            <Badge
                                variant='default'
                                className='text-xs bg-myBrown text-myDarkbrown hover:bg-myBrown'
                            >
                                {data[0].store_name}
                            </Badge>
                        )
                    )}
                    {/* {data && data.length > 0 && (
                        <Badge
                            variant='default'
                            className='text-xs bg-myBrown text-myDarkbrown hover:bg-myBrown'
                        >
                            {data[0].store_name}
                        </Badge>
                    )} */}
                </div>
                <div className='flex text-sm gap-2 self-end'>
                    {parCategory.toLowerCase() === 'pastry' && (
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
                        defaultValue={parCategory}
                        onValueChange={(value) => {
                            setParCategory(value);
                        }}
                        disabled={isSubmitting || isLoading}
                    >
                        <SelectTrigger className='w-fit h-8 text-sm'>
                            <SelectValue placeholder={parCategory} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className='h-8 text-sm' value='Pastry'>
                                Pastries
                            </SelectItem>
                            <SelectItem className='h-8 text-sm' value='CTC'>
                                CTC
                            </SelectItem>
                            <SelectItem
                                className='h-8 text-sm'
                                value='CCP&SYSCO'
                            >
                                CCP & Sysco
                            </SelectItem>
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
                    <CircleOff className='w-8 h-8 text-neutral-500' />
                    <p className='text-md text-neutral-500'>
                        No PAR levels found
                    </p>
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
                                            step='any'
                                            disabled={isSubmitting}
                                            autoComplete='off' // prevents auto-fill in most cases, which wont trigger onChange
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setData((prev) =>
                                                    prev?.map((p) =>
                                                        p.item_id ===
                                                        item.item_id
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
                                                const value =
                                                    e.currentTarget.value;
                                                setData((prev) =>
                                                    prev?.map((p) =>
                                                        p.item_id ===
                                                        item.item_id
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
