import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check, CircleOff, Send } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
// import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
// import { StoreList, STORE_LIST } from '@/components/types';
import { weekCloseToday } from '@/components/schedules';
import Image from 'next/image';
import placeholderPic from '/public/illustrations/sunlight.svg';
import { Badge } from '@/components/ui/badge';

export const categTypes = ['Meat', 'Pastry', 'Retail'] as const;
export type CategoryType = (typeof categTypes)[number];

// export const subCategTypes = [
//     'Closed',
//     'Sealed',
//     'Weight',
//     'Count',
//     'Expired',
//     'Reused',
// ] as const;
export const meatSubCategTypes = ['Closed', 'Sealed', 'Weight'] as const;
export type MeatSubCategoryType = (typeof meatSubCategTypes)[number];
export const retailSubCategTypes = ['Count', 'Expired', 'Reused'] as const;
export type RetailSubCategoryType = (typeof retailSubCategTypes)[number];
// export type SubCategoryType = (typeof subCategTypes)[number];

export type SundayCloseType = {
    id: number;
    name: string;
    categ: string;
    qty: number;
    store_id: number;
    submitted_at: string | null;
    updated_at: string | null;
};

// export type SundayCloseType = {
//     id: number;
//     name: string;
//     categ: string;
//     count: number;
//     closed_count: number;
//     sealed_count: number;
//     open_items_weight: number;
//     expired_count: number;
//     unexpired_count: number;
//     reused_count: number;
//     submitted_at: string | null;
//     updated_at: string | null;
//     was_updated: boolean;
// };
const meatInstructions =
    'Meat Instructions: Prior to close count closed boxes ("Closed"), unopened sealed packs ("Sealed"), and the weight ("Weight", in oz) of unopened sealed packs for each meat item.';

const pastryInstructions =
    'Pastry Instructions: Prior to close count the amount of each pastry item you have. The cakes are per slice.';

const retailInstructions =
    'Retail Beans Instructions: Prior to close count unexpired beans (count), expired beans (expired), and reused (reused) for your retail coffee bean items.';

export default function SundayCloseData({
    storeId,
}: // contentType,
// setRefreshTrigger,
{
    storeId: number;
    // contentType: ContentType;
    // setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [data, setData] = useState<SundayCloseType[]>([]);
    // const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [category, setCategory] = useState<CategoryType>('Meat');
    const [subCategory, setSubCategory] = useState(() => {
        if (category.toLowerCase() === 'meat') {
            return meatSubCategTypes[0];
        } else if (category.toLowerCase() === 'retail') {
            return retailSubCategTypes[0];
        } else {
            // pastry doesnt need subcateg's
            return 'none';
        }
    });
    const [instructions, setInstructions] = useState<string>(
        category.toLowerCase() === 'meat'
            ? meatInstructions
            : category.toLowerCase() === 'retail'
            ? retailInstructions
            : pastryInstructions
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [store, setStore] = useState<{ id: number; name: StoreList }>({
    //     id: STORE_LIST[0].id,
    //     name: STORE_LIST[0].name,
    // });
    // const [qty, setQty] = useState<number>(0);
    // const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { toast } = useToast();
    const signatureCakes = ['strawberry whip cream cake (square)', 'espresso ganache (square)', 'raspberry espresso ganache (square)', 'ava chocolate cake (square)']; // signature cakes to omit the (square) sizing at end for output purposes/UX only

    const handleSundayCloseSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault(); // stop page from refreshing
        // setFormFeedback(null);
        console.log(data);
        // return;

        setIsSubmitting(true);
        for (let item of data) {
            if (item.qty === null) {
                item.qty = 0;
            }
        }

        try {
            const response = await fetch('/api/v1/week-close', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data, subCateg: subCategory }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error);
            }

            toast({
                title: 'Sunday Close Sent',
                description: 'Sunday close has been sent successfully',
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
                title: 'Error Sending Sunday Close',
                description: errMsg,
                variant: 'destructive',
            });
        }

        setIsSubmitting(false);
        // setRefreshTrigger((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchSundayClose = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/api/v1/week-close?storeId=${storeId}&categ=${category}&subCateg=${subCategory}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                setData(data);
            } catch (error) {
                let errMsg;
                if (String(error).length > 100) {
                    errMsg = String(error).slice(0, 100) + '...';
                } else {
                    errMsg = String(error);
                }
                toast({
                    title: 'Error Fetching Sunday Close',
                    description: errMsg,
                    variant: 'destructive',
                });
                setData([]);
            }
            setIsLoading(false);
            // console.log(data);
        };

        const todaysDow = new Date().getDay();
        if (weekCloseToday(0)) {
            fetchSundayClose();
        }
    }, [category, subCategory]);

    return (
        <div className='flex flex-col h-full'>
            {isLoading && (
                <div className='flex flex-col gap-2 mt-4'>
                    <Skeleton className='h-5 w-full' />
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-5 w-1/4' />
                    <Skeleton className='h-12 w-full' />
                </div>
            )}
            {!isLoading && data && data.length === 0 && (
                <div className='flex flex-col items-center justify-center mt-1'>
                    {/* <CircleOff className='w-8 h-8 text-neutral-500' /> */}
                    <div className='flex flex-col text-neutral-500'>
                        <p className='text-sm'>
                            Perform stock counts and weighings of meat,
                            pastries, and retail beans at the end of every
                            Sunday.
                        </p>
                    </div>
                    <Image
                        src={placeholderPic}
                        alt='placeholder'
                        width={200}
                        height={200}
                        className='mt-2'
                        // className='w-20 h-20'
                    />
                    <p className='text-md text-neutral-500'>
                        No Sunday Close due today!
                    </p>
                </div>
            )}
            {!isLoading && data && data.length > 0 && (
                <div>
                    <div className='flex flex-col text-neutral-500'>
                        <p className='text-sm'>{instructions}</p>
                    </div>
                    <div className='flex text-sm gap-2 justify-end'>
                        {category.toLowerCase() !== 'pastry' && (
                            <Select
                                value={subCategory}
                                onValueChange={(value) => {
                                    setSubCategory(value);
                                }}
                                disabled={isSubmitting || isLoading}
                            >
                                <SelectTrigger className='w-fit h-8 text-sm'>
                                    <SelectValue placeholder={subCategory} />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.toLowerCase() === 'meat' &&
                                        meatSubCategTypes.map((subCategory) => (
                                            <SelectItem
                                                key={subCategory}
                                                className='h-8 text-sm'
                                                value={subCategory}
                                            >
                                                {subCategory}
                                            </SelectItem>
                                        ))}
                                    {category.toLowerCase() === 'retail' &&
                                        retailSubCategTypes.map(
                                            (subCategory) => (
                                                <SelectItem
                                                    key={subCategory}
                                                    className='h-8 text-sm'
                                                    value={subCategory}
                                                >
                                                    {subCategory}
                                                </SelectItem>
                                            )
                                        )}
                                </SelectContent>
                            </Select>
                        )}

                        <Select
                            value={category}
                            onValueChange={(value) => {
                                setCategory(value as CategoryType);
                                if (value.toLowerCase() === 'meat') {
                                    setSubCategory(meatSubCategTypes[0]);
                                    setInstructions(meatInstructions);
                                } else if (value.toLowerCase() === 'retail') {
                                    setSubCategory(retailSubCategTypes[0]);
                                    setInstructions(retailInstructions);
                                } else {
                                    // pastry
                                    setSubCategory('none');
                                    setInstructions(pastryInstructions);
                                }
                            }}
                            disabled={isSubmitting || isLoading}
                        >
                            <SelectTrigger className='w-fit h-8 text-sm'>
                                <SelectValue placeholder={category} />
                            </SelectTrigger>
                            <SelectContent>
                                {categTypes.map((category) => (
                                    <SelectItem
                                        key={category}
                                        className='h-8 text-sm'
                                        value={category}
                                    >
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <form
                        className='flex flex-col gap-2 mt-1'
                        onSubmit={handleSundayCloseSubmit}
                    >
                        <ScrollArea className='max-h-[60vh] overflow-y-auto'>
                            <div className='grid grid-cols-1 gap-1'>
                                {data.map((item) => (
                                    <div
                                        key={item.id}
                                        className='flex justify-between h-fit items-center mt-1 text-sm'
                                    >
                                        <div className='flex items-center gap-1'>
                                            {item.submitted_at &&
                                                item.qty !== null && (
                                                    <Badge
                                                        className='bg-myBrown'
                                                        variant='secondary'
                                                    >
                                                        <Check
                                                            size={10}
                                                            className='text-black'
                                                        />
                                                    </Badge>
                                                )}
                                            {item.categ.toLowerCase() ===
                                            'pastry' && signatureCakes.includes(item.name.toLowerCase())
                                                ? item.name
                                                      .split(' ')
                                                      .slice(0, -1)
                                                      .join(' ')
                                                : item.name}
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            {subCategory.toLowerCase() ===
                                                'weight' && (
                                                <p className='text-neutral-500 text-xs'>
                                                    (oz)
                                                </p>
                                            )}
                                            <input
                                                name='count'
                                                type='number'
                                                id={item.id.toString()}
                                                className='w-16 rounded-sm border-2 h-8 pl-1'
                                                // defaultValue={getDefaultValue(
                                                //     item,
                                                //     subCategory
                                                // )}
                                                defaultValue={Number(
                                                    item.qty === null
                                                        ? 0
                                                        : Number(
                                                              item.qty
                                                          ).toFixed(2)
                                                ).toFixed(2)}
                                                // value={item.level ?? 0}
                                                placeholder='0'
                                                step={0.5}
                                                disabled={isSubmitting}
                                                autoComplete='off'
                                                onChange={(e) => {
                                                    setData((prev) =>
                                                        prev?.map((p) =>
                                                            p.id === item.id
                                                                ? {
                                                                      ...p,
                                                                      qty: Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      ),
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
                            {/* {formFeedback && (
                                <div className='flex justify-center'>
                                    <p className='text-red-500 text-sm'>
                                        {formFeedback}
                                    </p>
                                </div>
                            )} */}
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

// function getDefaultValue(item: SundayCloseType, subCategory: SubCategoryType) {
//     switch (subCategory) {
//         case 'Closed':
//             return item.closed_count;
//         case 'Sealed':
//             return item.sealed_count;
//         case 'Weight':
//             return item.open_items_weight;
//         case 'Expired':
//             return item.expired_count;
//         case 'Reused':
//             return item.reused_count;
//         case 'Count':
//             return item.count;
//         default:
//             return 0;
//     }
// }
