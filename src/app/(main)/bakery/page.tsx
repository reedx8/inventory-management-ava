'use client';
import React, { useState, useEffect } from 'react';
import { HeaderBar } from '@/components/header-bar';
import { BakeryOrder } from '@/app/(main)/bakery/types';
import { BakeryColumns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
// import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import enIcon from '/public/icons/enIcon.png';
// import esIcon from '/public/icons/esIcon.png';
import SheetTemplate from '@/components/sheet/sheet-template';
// import { zodResolver } from '@zod/form';
// import { useForm } from 'react-hook-form';
import { Check, CircleOff, ListCheck, Pencil, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { STORE_LOCATIONS } from '@/components/types';
import { NoPastriesDue } from '@/components/placeholders';
import PagesNavBar from '@/components/pages-navbar';

// export const dummyData: BakeryOrder[] = [
//     {
//         id: 1,
//         name: 'Chocolate Croissant',
//         units: '1 Pc',
//         order_qty: 24,
//         completed_at: '2025-02-11T15:30:00Z',
//     },
//     {
//         id: 2,
//         name: 'Blueberry Muffin',
//         units: '1 Pc',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 3,
//         name: 'Apple Danish',
//         units: '1 Pc',
//         order_qty: 15,
//         completed_at: '2025-02-12T09:45:00Z',
//     },
//     {
//         id: 4,
//         name: 'Vanilla Eclair',
//         units: '1 Pc',
//         order_qty: 30,
//         completed_at: undefined,
//     },
//     {
//         id: 5,
//         name: 'Cinnamon Roll',
//         units: '1 Pc',
//         order_qty: 42,
//         completed_at: '2025-02-12T11:20:00Z',
//     },
//     {
//         id: 6,
//         name: 'Lemon Tart',
//         units: '1 Pc',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 7,
//         name: 'Almond Biscotti',
//         units: '1 Pc',
//         order_qty: 18,
//         completed_at: '2025-02-11T16:15:00Z',
//     },
//     {
//         id: 8,
//         name: 'Red Velvet Cupcake',
//         units: '1 Pc',
//         order_qty: 56,
//         completed_at: '2025-02-12T10:30:00Z',
//     },
//     {
//         id: 9,
//         name: 'Raspberry Danish',
//         units: '1 Pc',
//         order_qty: 21,
//         completed_at: undefined,
//     },
//     {
//         id: 10,
//         name: 'Banana Nut Bread',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 11,
//         name: 'Strawberry Scone',
//         order_qty: 33,
//         completed_at: '2025-02-12T08:45:00Z',
//     },
//     {
//         id: 12,
//         name: 'Chocolate Chip Cookie',
//         order_qty: 100,
//         completed_at: '2025-02-11T14:20:00Z',
//     },
//     { id: 13, name: 'Pecan Pie Slice', order_qty: 12, completed_at: undefined },
//     {
//         id: 14,
//         name: 'Coconut Macaroon',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 15,
//         name: 'Caramel Brownie',
//         order_qty: 45,
//         completed_at: '2025-02-12T12:10:00Z',
//     },
//     {
//         id: 16,
//         name: 'Pumpkin Muffin',
//         order_qty: 27,
//         completed_at: '2025-02-11T17:30:00Z',
//     },
//     {
//         id: 17,
//         name: 'Cherry Turnover',
//         units: '1 Pc',
//         order_qty: 16,
//         completed_at: undefined,
//     },
//     {
//         id: 18,
//         name: 'Maple Donut',
//         units: '1 Pc',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 19,
//         name: 'Tiramisu Slice',
//         units: '1 Pc',
//         order_qty: 9,
//         completed_at: '2025-02-12T13:15:00Z',
//     },
//     {
//         id: 20,
//         name: 'Oatmeal Raisin Cookie',
//         order_qty: 72,
//         completed_at: '2025-02-11T15:45:00Z',
//     },
//     { id: 21, name: 'Cheese Danish', order_qty: 25, completed_at: undefined },
//     {
//         id: 22,
//         name: 'Blackberry Scone',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 23,
//         name: 'Pistachio Croissant',
//         order_qty: 14,
//         completed_at: '2025-02-12T09:20:00Z',
//     },
//     {
//         id: 24,
//         name: 'Hazelnut Biscotti',
//         units: '1 Pc',
//         order_qty: 22,
//         completed_at: '2025-02-11T16:40:00Z',
//     },
//     {
//         id: 25,
//         name: 'Orange Cranberry Muffin',
//         order_qty: 31,
//         completed_at: undefined,
//     },
//     {
//         id: 26,
//         name: 'White Chocolate Macadamia Cookie',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 27,
//         name: 'Matcha Green Tea Scone',
//         units: '1 Pc',
//         order_qty: 17,
//         completed_at: '2025-02-12T10:55:00Z',
//     },
//     {
//         id: 28,
//         name: 'Dark Chocolate Eclair',
//         units: '1 Pc',
//         order_qty: 28,
//         completed_at: '2025-02-11T14:50:00Z',
//     },
//     {
//         id: 29,
//         name: 'Lavender Shortbread',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 30,
//         name: 'Carrot Cake Slice',
//         units: '1 Pc',
//         order_qty: 19,
//         completed_at: '2025-02-12T11:40:00Z',
//     },
//     {
//         id: 31,
//         name: 'Earl Grey Tea Cookie',
//         order_qty: 40,
//         completed_at: undefined,
//     },
//     {
//         id: 32,
//         name: 'Apricot Danish',
//         order_qty: undefined,
//         completed_at: undefined,
//     },
//     {
//         id: 33,
//         name: 'Salted Caramel Brownie',
//         units: '1 Pc',
//         order_qty: 35,
//         completed_at: '2025-02-11T17:05:00Z',
//     },
//     {
//         id: 34,
//         name: 'Mixed Berry Tart',
//         units: '1 Pc',
//         order_qty: 23,
//         completed_at: '2025-02-12T12:35:00Z',
//     },
//     {
//         id: 35,
//         name: 'Chocolate Hazelnut Croissant',
//         units: '1 Pc',
//         order_qty: 29,
//         completed_at: undefined,
//     },
// ];
// const dummyData: BakeryOrder[] = [
//     {
//         id: 1,
//         name: 'Peach & Cream Cheese Turnover',
//         units: '1 Pc',
//         order_qty: 23,
//         is_complete: false,
//     },
//     {
//         id: 2,
//         name: 'Blueberry Muffin',
//         units: '1 Pc',
//         order_qty: 18,
//         is_complete: false,
//     },
//     {
//         id: 3,
//         name: 'Croissant',
//         units: '1 Pc',
//         order_qty: undefined,
//         is_complete: false,
//     },
//     {
//         id: 4,
//         name: 'Cheese Bagel',
//         units: '4 Pcs/Pack',
//         order_qty: 12,
//         is_complete: false,
//     },
//     {
//         id: 5,
//         name: 'Strawberry Whip Cream Cake (Quarter)',
//         units: '1/4 Cake',
//         order_qty: 29,
//         is_complete: false,
//     },
//     {
//         id: 6,
//         name: 'Chocolate Chip Muffin',
//         units: '1 Pc',
//         order_qty: 44,
//         is_complete: false,
//     },
//     {
//         id: 7,
//         name: 'Pecan Cranberry Muffin',
//         units: '1 Pc',
//         order_qty: undefined,
//         is_complete: false,
//     },
//     {
//         id: 8,
//         name: 'Zu Zus',
//         units: '12 Pcs/Pack',
//         order_qty: 2,
//         is_complete: false,
//     },
//     {
//         id: 9,
//         name: 'Napoleon',
//         units: '1 Pc',
//         order_qty: undefined,
//         is_complete: false,
//     },
//     {
//         id: 10,
//         name: 'Macaroon',
//         units: '1 Pc',
//         order_qty: 16,
//         is_complete: false,
//     },
//     {
//         id: 11,
//         name: 'Fruit Tart',
//         units: '1 Pc',
//         order_qty: 67,
//         is_complete: false,
//     },
// ];

export default function Bakery() {
    const [data, setData] = useState<BakeryOrder[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    // handes edit button click on page basically
    const handleSheetSubmission = async (formData: BakeryOrder[]) => {
        // console.log('handle auto submit pressed');
        // console.log('formData (handleSheetSubmission): ', formData);
        try {
            const response = await fetch(
                '/api/v1/bakerys-orders?submitType=edit',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );
            await response.json();

            if (!response.ok) {
                const msg = `Failed sending bakery's edited orders`;
                throw new Error(msg);
            }
            // console.log('data sent: ', result);
            toast({
                title: 'Order Counts Sent',
                description: 'Your counts have been sent successfully',
                className: 'bg-myBrown border-none text-myDarkbrown',
            });
        } catch (error) {
            const err = error as Error;
            toast({
                title: 'Error',
                description: err.message,
                variant: 'destructive',
            });
        }

        // Update local state, show success message, etc.
    };
    const handleBatchCompleteBtn = async () => {
        // console.log('handle auto submit pressed');
        try {
            const response = await fetch(
                '/api/v1/bakerys-orders?submitType=batch',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            await response.json();
            // console.log('batch complete btn result: ', result);
            if (!response.ok) {
                const msg = `Failed sending bakery's completed batched orders`;
                throw new Error(msg);
            }
            // console.log('data sent: ', result);
            toast({
                title: 'Order Counts Sent',
                description: 'Your counts have been sent successfully',
                className: 'bg-myBrown border-none text-myDarkbrown',
            });
        } catch (error) {
            const err = error as Error;
            // Handle error (show toast, etc.)
            toast({
                title: 'Error',
                description: err.message,
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        const getBakerysOrders = async () => {
            try {
                const response = await fetch('/api/v1/bakerys-orders');
                const data = await response.json();
                // console.log('data: ', data);
                console.log(data);

                if (!response.ok) {
                    console.log(data.response);
                    const msg = `Failed to fetch bakery's orders`;
                    throw new Error(msg);
                }

                setData(data);
            } catch (error) {
                // console.error('Error fetching bakerys orders:', error);
                const err = error as Error;

                toast({
                    title: 'Error Fetching Orders',
                    description: err.message,
                    variant: 'destructive',
                });
                setData([]);
            }
            setIsLoading(false);
        };

        getBakerysOrders();

        // testing:
        // setData(dummyData);
        // setIsLoading(false);
    }, [toast]);

    return (
        <main>
            <HeaderBar pageName={'Bakery'} />
            <div className='mb-6'><PagesNavBar /></div>
            <section className='mb-6' />
            {isLoading && !data && (
                <section className='flex flex-col gap-3'>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                    <Skeleton className='h-4 w-[14%]' />
                    <div className='grid grid-cols-4 gap-4 w-full'>
                        <Skeleton className='h-6 col-span-2' />
                        <Skeleton className='h-6 col-span-1' />
                        <Skeleton className='h-6 col-span-1' />
                    </div>
                </section>
            )}
            {!isLoading && data && data?.length > 0 && (
                <section className='flex flex-col'>
                    <div className='flex justify-end gap-2 mb-2'>
                        <SheetTemplate
                            title='Edit Completed Orders'
                            trigger={
                                <Button
                                    variant='myTheme4'
                                    // variant='outline'
                                    // className='border-myDarkbrown text-myDarkbrown'
                                >
                                    <Pencil className='' />
                                    Edit
                                </Button>
                            }
                            description={
                                'Update the number of completed orders for each store today and press Submit when finished.'
                            }
                            // noItemsText={'No Pastry Orders Yet!'}
                        >
                            <BakeryOrdersForm
                                // data={data}
                                onSubmit={handleSheetSubmission}
                            />
                        </SheetTemplate>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant='myTheme5'>
                                    <ListCheck />
                                    Batch Complete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Complete All Orders?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Press Submit only if orders for all
                                        stores were successfully completed.
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                        Otherwise, Press Cancel and navigate to
                                        Edit instead.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            variant='myTheme'
                                            onClick={handleBatchCompleteBtn}
                                        >
                                            Submit
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {/* <Button variant='myTheme' size='lg' className='w-fit self-end'>
                        Auto-Complete Orders
                    </Button> */}
                    </div>
                    <DataTable
                        columns={BakeryColumns}
                        data={data}
                        tableHeader={
                            <div className='mb-2 ml-3'>
                                <h1 className='text-lg font-semibold text-black/80'>
                                    {`Today's Bakery Orders`}
                                </h1>
                                <p className='text-neutral-500/70 text-xs'>
                                    Total items due: {data.length}
                                </p>
                                <p className='text-neutral-500/70 text-xs'>
                                    Orders from stores are due everyday by 9
                                    A.M.
                                </p>
                            </div>
                        }
                    />
                </section>
            )}
            {!isLoading && data && data?.length === 0 && (
                <section className='flex justify-center'>
                    <NoPastriesDue />
                </section>
            )}
        </main>
    );
}

type BakeryOrdersFormProps = {
    data?: BakeryOrder[];
    onSubmit?: (data: BakeryOrder[]) => Promise<void>;
    // onSubmit?: (data: { arg1: BakeryOrder[] }) => Promise<void>;
};

const BakeryOrdersForm = ({ onSubmit }: BakeryOrdersFormProps) => {
    // const [formData, setFormData] = React.useState<BakeryOrder[]>(data);
    const [formData, setFormData] = useState<BakeryOrder[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    const [storeLocation, setStoreLocation] = React.useState<string>(
        STORE_LOCATIONS[0]
    );

    useEffect(() => {
        async function getStoresOrders() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    '/api/v1/bakerys-orders?storeLocation=' + storeLocation
                );
                const data = await response.json();
                if (!response.ok) {
                    const msg = `Failed to fetch store's bakery orders`;
                    throw new Error(msg);
                }
                setFormData(data);
            } catch (error) {
                // console.error('Error fetching bakerys orders:', error);
                const err = error as Error;

                toast({
                    title: 'Error Fetching Orders',
                    description: err.message,
                    variant: 'destructive',
                });
                setFormData([]);
            }
            setIsLoading(false);
        }
        getStoresOrders();
    }, [storeLocation, toast]);

    const handleInputChange = (orderId: number, newValue: number) => {
        setFormData((prevData) =>
            prevData?.map((order) =>
                order.id === orderId
                    ? { ...order, order_qty: Number(newValue) }
                    : order
            )
        );
    };

    const handleSubmit = async (updatedData: BakeryOrder[]) => {
        // const handleSubmit = async (formData: { orders: BakeryOrder[] }) => {
        try {
            setIsSubmitting(true);
            await onSubmit?.(updatedData);
            // You might want to close the sheet or show a success message here
            // console.log('Form data submitted:', formData);
        } catch (error) {
            console.log('Failed to update orders:', error);
            // Handle error (show toast, etc.)
            // toast({
            //     title: 'Error',
            //     description: 'Failed to update orders',
            //     variant: 'destructive',
            // });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // keeps toast from closing immediately and page refreshing immediately on submit
        handleSubmit(formData);
    };

    // console.log('storeLocation: ', storeLocation);

    return (
        <div>
            {isLoading && (
                <div className='flex flex-col gap-2 mt-2'>
                    <Skeleton className='h-6 w-[20%] self-end' />
                    <Skeleton className='h-6 w-[100%]' />
                    <Skeleton className='h-6 w-[100%]' />
                    <Skeleton className='h-6 w-[100%]' />
                </div>
            )}
            {!isLoading && (
                <form
                    onSubmit={onSubmitWrapper}
                    className='flex flex-col gap-2 mx-1'
                >
                    <div className='self-end mt-2'>
                        <Select
                            onValueChange={(value) => setStoreLocation(value)}
                        >
                            <SelectTrigger className='w-fit h-6'>
                                <SelectValue placeholder={storeLocation} />
                            </SelectTrigger>
                            <SelectContent>
                                {STORE_LOCATIONS.map((store) => (
                                    <SelectItem value={store} key={store}>
                                        {store}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <ScrollArea className='max-h-[50vh] sm:max-h-[65vh] overflow-y-auto'>
                        {formData?.length > 0 &&
                            formData.map((order) => (
                                <div
                                    key={order.id}
                                    className='flex items-center justify-between text-sm my-2'
                                >
                                    <div className='flex items-center gap-1'>
                                        {order.completed_at && (
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
                                        <div
                                            className={`text-sm ${
                                                order.completed_at
                                                    ? 'text-neutral-400 line-through'
                                                    : ''
                                            }`}
                                        >
                                            {order.name}
                                        </div>

                                        {/* {order.completed_at ?? <Badge className='ml-1 text-xs'>{order.units}</Badge>} */}
                                    </div>
                                    <input
                                        id={`completed-${order.id}`}
                                        type='number'
                                        value={Number(order.order_qty)}
                                        // defaultValue={order.order_qty}
                                        step={0.5}
                                        min={0}
                                        // max={order.orderedQuantity}
                                        // className='w-20 px-2 py-1 border rounded bg-red-300'
                                        className={`w-20 px-2 py-1 border rounded ${
                                            order.completed_at
                                                ? 'bg-neutral-100 text-neutral-400'
                                                : ''
                                        }`}
                                        onChange={(e) =>
                                            handleInputChange(
                                                order.id,
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        {formData?.length <= 0 && (
                            <>
                                <CircleOff className='text-neutral-500 mx-auto' />
                                <p className='text-neutral-500 text-center text-sm my-2'>
                                    No {storeLocation} orders due yet
                                </p>
                            </>
                        )}
                    </ScrollArea>

                    <Button
                        variant='myTheme'
                        type='submit'
                        disabled={isSubmitting || formData?.length <= 0}
                        className='w-full'
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                        <Send className='ml-1 h-4 w-4' />
                    </Button>
                </form>
            )}
        </div>
    );
};

// function englishTab({ handleBatchCompleteBtn }: () => Promise<void>) {
//     return (
//         <>
//             <AlertDialogHeader>
//                 <AlertDialogTitle>Complete All Orders? </AlertDialogTitle>
//                 <AlertDialogDescription>
//                     Press Submit only if all orders were successfully completed
//                 </AlertDialogDescription>
//                 <AlertDialogDescription>
//                     Otherwise, Press Cancel
//                 </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction asChild>
//                     <Button variant='myTheme' onClick={handleBatchCompleteBtn}>
//                         Submit
//                     </Button>
//                 </AlertDialogAction>
//             </AlertDialogFooter>
//         </>
//     );
// }

// function spanishTab() {
//     return (
//         <>
//             <AlertDialogHeader>
//                 <AlertDialogTitle>
//                     ¿Completar Todos Los Pedidos?
//                 </AlertDialogTitle>
//                 <AlertDialogDescription>
//                     Presione Enviar solo si todos los pedidos se completaron
//                     correctamente
//                 </AlertDialogDescription>
//                 <AlertDialogDescription>
//                     De lo contrario, presione Cancelar
//                 </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
//                 <AlertDialogAction asChild>
//                     <Button variant='myTheme'>Enviar</Button>
//                 </AlertDialogAction>
//             </AlertDialogFooter>
//         </>
//     );
// }
