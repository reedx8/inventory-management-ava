'use client';
import React, { useState, useEffect } from 'react';
import noPastriesPic from '/public/illustrations/cooking.svg';
import Image from 'next/image';
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
import { ListCheck, Pencil, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const dummyData: BakeryOrder[] = [
    { id: 1, name: 'Chocolate Croissant', units: '1 Pc', order_qty: 24 },
    { id: 2, name: 'Blueberry Muffin', units: '1 Pc', order_qty: undefined },
    { id: 3, name: 'Apple Danish', units: '1 Pc', order_qty: 15 },
    { id: 4, name: 'Vanilla Eclair', units: '1 Pc', order_qty: 30 },
    { id: 5, name: 'Cinnamon Roll', units: '1 Pc', order_qty: 42 },
    { id: 6, name: 'Lemon Tart', units: '1 Pc', order_qty: undefined },
    { id: 7, name: 'Almond Biscotti', units: '1 Pc', order_qty: 18 },
    { id: 8, name: 'Red Velvet Cupcake', units: '1 Pc', order_qty: 56 },
    { id: 9, name: 'Raspberry Danish', units: '1 Pc', order_qty: 21 },
    { id: 10, name: 'Banana Nut Bread', order_qty: undefined },
    { id: 11, name: 'Strawberry Scone', order_qty: 33 },
    { id: 12, name: 'Chocolate Chip Cookie', order_qty: 100 },
    { id: 13, name: 'Pecan Pie Slice', order_qty: 12 },
    { id: 14, name: 'Coconut Macaroon', order_qty: undefined },
    { id: 15, name: 'Caramel Brownie', order_qty: 45 },
    { id: 16, name: 'Pumpkin Muffin', order_qty: 27 },
    { id: 17, name: 'Cherry Turnover', units: '1 Pc', order_qty: 16 },
    { id: 18, name: 'Maple Donut', units: '1 Pc', order_qty: undefined },
    { id: 19, name: 'Tiramisu Slice', units: '1 Pc', order_qty: 9 },
    { id: 20, name: 'Oatmeal Raisin Cookie', order_qty: 72 },
    { id: 21, name: 'Cheese Danish', order_qty: 25 },
    { id: 22, name: 'Blackberry Scone', order_qty: undefined },
    { id: 23, name: 'Pistachio Croissant', order_qty: 14 },
    { id: 24, name: 'Hazelnut Biscotti', units: '1 Pc', order_qty: 22 },
    { id: 25, name: 'Orange Cranberry Muffin', order_qty: 31 },
    { id: 26, name: 'White Chocolate Macadamia Cookie', order_qty: undefined },
    { id: 27, name: 'Matcha Green Tea Scone', units: '1 Pc', order_qty: 17 },
    { id: 28, name: 'Dark Chocolate Eclair', units: '1 Pc', order_qty: 28 },
    { id: 29, name: 'Lavender Shortbread', order_qty: undefined },
    { id: 30, name: 'Carrot Cake Slice', units: '1 Pc', order_qty: 19 },
    { id: 31, name: 'Earl Grey Tea Cookie', order_qty: 40 },
    { id: 32, name: 'Apricot Danish', order_qty: undefined },
    { id: 33, name: 'Salted Caramel Brownie', units: '1 Pc', order_qty: 35 },
    { id: 34, name: 'Mixed Berry Tart', units: '1 Pc', order_qty: 23 },
    {
        id: 35,
        name: 'Chocolate Hazelnut Croissant',
        units: '1 Pc',
        order_qty: 29,
    },
];
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
        try {
            const response = await fetch('/api/v1/bakerys-orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) {
                const msg = `Failed to update bakery's orders`;
                throw new Error(msg);
            }
            // console.log('data sent: ', result);
            toast({
                title: 'Order Counts Sent',
                description: 'Your counts have been sent successfully',
                className: 'bg-myBrown border-none text-myDarkbrown',
            });
        } catch (error) {
            const errMsg = 'Check API route handler and/or HTTP method';
            console.error(
                'Error from API route handler or HTTP method: ',
                error
            );
            // Handle error (show toast, etc.)
            toast({
                title: 'Error',
                description: errMsg,
                variant: 'destructive',
            });
        }

        // Update local state, show success message, etc.
    };
    const handleBatchCompleteBtn = async () => {
        // console.log('handle auto submit pressed');
        try {
            const response = await fetch('/api/v1/bakerys-orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                const msg = `Failed to update bakery's orders`;
                throw new Error(msg);
            }
            // console.log('data sent: ', result);
            toast({
                title: 'Order Counts Sent',
                description: 'Your counts have been sent successfully',
                className: 'bg-myBrown border-none text-myDarkbrown',
            });
        } catch (error) {
            const errMsg = 'Check API route handler and/or HTTP method';
            console.error(
                'Error from API route handler or HTTP method: ',
                error
            );
            // Handle error (show toast, etc.)
            toast({
                title: 'Error',
                description: errMsg,
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        const getBakerysOrders = async () => {
            try {
                const response = await fetch('/api/v1/bakerys-orders');
                const data = await response.json();

                if (!response.ok) {
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
            {/* <div className='mb-6'><PagesNavBar /></div> */}
            <section className='mb-6' />
            {isLoading && (
                <section className='flex flex-col gap-3'>
                    <Skeleton className='h-12 w-[80%]' />
                    <Skeleton className='h-6 w-[80%]' />
                    <Skeleton className='h-6 w-[65%]' />
                    <Skeleton className='h-6 w-[50%]' />
                </section>
            )}
            {!isLoading && data && data?.length > 0 && (
                <section className='flex flex-col'>
                    <div className='flex justify-end gap-2 mb-2'>
                        <SheetTemplate
                            title='Edit Completed Orders'
                            trigger={
                                <Button
                                    variant='outline'
                                    className='border-myDarkbrown text-myDarkbrown'
                                >
                                    <Pencil className='' />
                                    Edit
                                </Button>
                            }
                            description={
                                'At end of day, manually update how many orders you actually made. When done, press Submit.'
                            }
                            // noItemsText={'No Pastry Orders Yet!'}
                        >
                            <BakeryOrdersForm
                                data={data}
                                onSubmit={handleSheetSubmission}
                            />
                        </SheetTemplate>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant='myTheme' className='w-fit'>
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
                                        Press Submit only if all orders were
                                        successfully completed.
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                        Otherwise, Press Cancel.
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
                    <DataTable columns={BakeryColumns} data={data} />
                </section>
            )}
            {!isLoading && data && data?.length === 0 && (
                <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                    <Image
                        src={noPastriesPic}
                        alt='no pastries pic'
                        width={250}
                        height={250}
                        className='drop-shadow-lg'
                    />
                    <p className='text-2xl text-gray-600'>No Pastries Due!</p>
                    <p className='text-sm text-gray-400'>
                        All pastries have been completed
                    </p>
                    {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
                </section>
            )}
        </main>
    );
}
// Example type for bakery order data
// type BakeryOrder = {
//     id: string;
//     itemName: string;
//     orderedQuantity: number;
//     completedQuantity: number;
// };

type BakeryOrdersFormProps = {
    data: BakeryOrder[];
    onSubmit?: (data: BakeryOrder[]) => Promise<void>;
    // onSubmit?: (data: { arg1: BakeryOrder[] }) => Promise<void>;
};

const BakeryOrdersForm = ({ data, onSubmit }: BakeryOrdersFormProps) => {
    const [formData, setFormData] = React.useState<BakeryOrder[]>(data);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { toast } = useToast();

    const handleInputChange = (orderId: number, newValue: number) => {
        setFormData((prevData) =>
            prevData.map((order) =>
                order.id === orderId ? { ...order, order_qty: newValue } : order
            )
        );
    };

    const handleSubmit = async (updatedData: BakeryOrder[]) => {
        // const handleSubmit = async (formData: { orders: BakeryOrder[] }) => {
        try {
            setIsSubmitting(true);
            await onSubmit?.(updatedData);
            // You might want to close the sheet or show a success message here
            console.log('Form data submitted:', formData);
        } catch (error) {
            console.error('Failed to update orders:', error);
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

    return (
        <form onSubmit={onSubmitWrapper} className='flex flex-col gap-2'>
            <ScrollArea className='max-h-[50vh] sm:max-h-[65vh] overflow-y-auto'>
                {formData.map((order) => (
                    <div
                        key={order.id}
                        className='flex items-center justify-between text-sm my-2 mx-1'
                    >
                        <div className='font-medium'>{order.name}</div>
                        <input
                            id={`completed-${order.id}`}
                            type='number'
                            value={order.order_qty}
                            // defaultValue={order.order_qty}
                            step={0.5}
                            min={0}
                            // max={order.orderedQuantity}
                            className='w-20 px-2 py-1 border rounded'
                            onChange={(e) =>
                                handleInputChange(
                                    order.id,
                                    Number(e.target.value)
                                )
                            }
                        />
                    </div>
                ))}
            </ScrollArea>

            <Button
                variant='myTheme'
                type='submit'
                disabled={isSubmitting}
                className='w-full'
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                <Send className='ml-1 h-4 w-4' />
            </Button>
        </form>
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
