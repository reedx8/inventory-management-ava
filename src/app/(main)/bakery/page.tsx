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
import {
    Check,
    CircleOff,
    Expand,
    ListCheck,
    Minimize2,
    Pencil,
    Printer,
    Send,
} from 'lucide-react';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';
import { createPortal } from 'react-dom';
// import { Separator } from '@/components/ui/separator';

export default function Bakery() {
    const [data, setData] = useState<BakeryOrder[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [isSubmittingBatch, setIsSubmittingBatch] = useState<boolean>(false);
    const [openPrintView, setOpenPrintView] = useState<boolean>(false);
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

        // refreshes view
        setRefreshTrigger((prev) => prev + 1);

        // Update local state, show success message, etc.
    };
    const handleBatchCompleteBtn = async () => {
        // console.log('handle auto submit pressed');
        setIsSubmittingBatch(true);
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

        setIsSubmittingBatch(false);
        // simply refreshes view (see useEffect dependency array)
        setRefreshTrigger((prev) => prev + 1);
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
    }, [toast, refreshTrigger]);

    return (
        <main>
            <HeaderBar pageName={'Bakery'} />
            <div className='flex justify-between items-center'>
                <PagesNavBar />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant='ghost'
                            className='flex gap-2 text-myDarkbrown hover:bg-transparent hover:text-myDarkbrown/60'
                        >
                            <Info /> <p className='text-xs'>Info</p>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='mr-2 flex flex-col gap-2 text-neutral-500 text-sm'>
                        <p>
                            Daily pasty orders from each store will show on this
                            page every morning by 9 AM.
                        </p>
                        <p>{`You can fulfill individual items in the edit button, and/or batch complete the
                        entire day's orders.`}</p>
                        <p>
                            Batch complete will mark all remaining items for the
                            day as fulfilled.
                        </p>
                    </PopoverContent>
                </Popover>
            </div>
            {/* <section className='mb-1' /> */}
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
                    <div className='flex justify-between mb-2'>
                        <Button
                            variant='ghost'
                            onClick={() => setOpenPrintView(true)}
                            className='p-0 flex gap-2 text-myDarkbrown hover:bg-transparent hover:text-myDarkbrown/60'
                        >
                            <Expand /> <p className='text-sm'>Print View</p>
                        </Button>
                        <div>
                            <SheetTemplate
                                title='Edit Completed Orders'
                                trigger={
                                    <Button
                                        variant='ghost'
                                        className='text-sm text-myDarkbrown hover:bg-transparent hover:text-myDarkbrown/60'
                                        // variant='myTheme4'
                                        disabled={isSubmittingBatch}
                                        // variant='outline'
                                        // className='border-myDarkbrown text-myDarkbrown'
                                    >
                                        <Pencil />
                                        Edit
                                    </Button>
                                }
                                isCollapsible={true}
                                description={`Enter in the number of actual orders completed for each item. Pressing Submit will only send those items edited. Use batch complete to send the remaining orders.`}
                                // noItemsText={'No Pastry Orders Yet!'}
                            >
                                <BakeryOrdersForm
                                    // data={data}
                                    onSubmit={handleSheetSubmission}
                                />
                            </SheetTemplate>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant='myTheme5'
                                        disabled={isSubmittingBatch}
                                    >
                                        <ListCheck />
                                        Batch Complete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Fulfill All Orders?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Press Submit only if all store
                                            orders were successfully fulfilled.
                                            Otherwise press Cancel.
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
                                                disabled={isSubmittingBatch}
                                            >
                                                Submit
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
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
                                <p className='text-neutral-500/70 text-sm'>
                                    Total items due: {data.length}
                                </p>
                                <p className='text-neutral-500/70 text-xs'>
                                    Orders from stores are due everyday by 9
                                    A.M.
                                </p>
                            </div>
                        }
                    />
                    {openPrintView && (
                        <PrintView
                            openPrintView={openPrintView}
                            setOpenPrintView={setOpenPrintView}
                            data={data}
                        />
                    )}
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

const PrintView = ({
    openPrintView,
    setOpenPrintView,
    data,
}: {
    openPrintView: boolean;
    setOpenPrintView: (open: boolean) => void;
    data: BakeryOrder[];
}) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return createPortal(
        <div className={`${openPrintView ? 'print-view-overlay' : ''} fixed inset-0 w-screen h-screen z-[999999] bg-white flex flex-col px-8`} >
            <Button
                className='button-view fixed top-2 right-2'
                variant='myTheme'
                onClick={() => setOpenPrintView(false)}
            >
                <Minimize2 style={{ width: '20px', height: '20px' }} />
            </Button>
            <Button
                className='button-view fixed bottom-2 right-2 text-md'
                variant='myTheme'
                onClick={() => window.print()}
            >
                <Printer style={{ width: '20px', height: '20px' }} />
                Print
            </Button>
            <div className='grid grid-cols-1 overflow-y-auto'>
                <div className='grid grid-cols-9 text-sm border'>
                    <p className='text-md col-span-4 font-semibold'>Name</p>
                    {STORE_LOCATIONS.map((store) => (
                        <p key={store} className='text-md font-semibold text-center'>
                            {store}
                        </p>
                    ))}
                    <p className='text-md font-semibold text-right bg-neutral-100'>Total</p>
                </div>
                <div className='grid grid-cols-1'>
                    {data.map((order) => (
                        <div key={order.id} className='grid grid-cols-9 text-sm border'>
                            <p className='col-span-4 border-r'>{order.name}</p>
                            {STORE_LOCATIONS.map((store_location) => (
                                <p key={store_location} className='text-center border-r'>
                                    {
                                        order.store_data?.find(
                                            (store) => store.store_name === store_location
                                        )?.order_qty || '-'
                                    }
                                </p>
                            ))}
                            <p className='text-right font-semibold bg-neutral-100'>{Number(Number(order.order_qty).toFixed(2))}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
};

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
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [sheetFeedback, setSheetFeedback] = useState<string | null>('');
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
        setSheetFeedback(null);
    }, [storeLocation, toast, refreshTrigger]);

    const handleInputChange = (orderId: number, newValue: number) => {
        setFormData((prevData) =>
            prevData?.map((order) =>
                order.id === orderId
                    ? {
                          ...order,
                          order_qty: Number(newValue),
                          was_edited: true,
                      }
                    : order
            )
        );
    };

    const handleSubmit = async (updatedData: BakeryOrder[]) => {
        // const handleSubmit = async (formData: { orders: BakeryOrder[] }) => {
        try {
            const editedOrders = updatedData.filter(
                (order) => order.was_edited
            );
            if (editedOrders.length === 0) {
                setSheetFeedback(
                    'No orders were edited. Please edit at least one order before submitting.'
                );
                return;
            }
            setIsSubmitting(true);
            await onSubmit?.(editedOrders);
            // await onSubmit?.(updatedData);
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
        }
        setIsSubmitting(false);
        setRefreshTrigger((prev) => prev + 1);
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
                <form onSubmit={onSubmitWrapper} className='flex flex-col mx-1'>
                    <div className='self-end mt-2 mb-1'>
                        <Select
                            onValueChange={(value) => setStoreLocation(value)}
                        >
                            <SelectTrigger className='w-fit h-8'>
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
                    <ScrollArea className='max-h-[50vh] sm:max-h-[60vh] overflow-y-auto'>
                        {/* <ScrollArea className='max-h-[50vh] sm:max-h-[65vh] overflow-y-auto'> */}
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
                                    </div>
                                    <input
                                        id={`completed-${order.id}`}
                                        type='number'
                                        value={
                                            Number(Number(order.made_qty).toFixed(2)) ||
                                            Number(Number(order.order_qty).toFixed(2)) ||
                                            ''
                                        }
                                        min='0'
                                        step='any'
                                        placeholder='0'
                                        className={`w-20 px-2 py-1 border rounded ${
                                            order.completed_at
                                                ? 'bg-neutral-100 text-neutral-400'
                                                : ''
                                        }`}
                                        readOnly={
                                            order.completed_at ? true : false
                                        }
                                        // onFocus and onClick allows consistent selection of all text in input field
                                        onFocus={(e) => {
                                            // e.target.select();
                                            setTimeout(() => {
                                                e.target.select();
                                                // setTimeout(() => e.target.select(), 100);
                                            }, 0);
                                        }}
                                        onClick={(e) =>
                                            (
                                                e.target as HTMLInputElement
                                            ).select()
                                        }
                                        // onTouchStart={(e) => (e.target as HTMLInputElement).select()}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        onChange={(e) =>
                                            handleInputChange(
                                                order.id,
                                                e.target.value === ''
                                                    ? 0
                                                    : Number(e.target.value)
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
                    {/* Removed reason: Need to find solution to manually close modal after hitting its submit btn*/}
                    {/* <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='myTheme5' className='w-full'>
                                Submit
                                <Send />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {`Complete All ${storeLocation} Orders?`}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {`Press Submit only if all orders from ${storeLocation} are ready to be completed.`}
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    Otherwise, Press Cancel.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    asChild
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSubmitWrapper();
                                    }}
                                >
                                    <Button
                                        type='submit'
                                        variant='myTheme'
                                        disabled={
                                            isSubmitting ||
                                            formData?.length <= 0
                                        }
                                    >
                                        {isSubmitting
                                            ? 'Submitting...'
                                            : 'Submit'}
                                        <Send className='ml-1 h-4 w-4' />
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog> */}

                    <Button
                        variant='myTheme'
                        type='submit'
                        disabled={
                            isSubmitting ||
                            formData?.length <= 0 ||
                            formData.every((order) => order.completed_at)
                        }
                        className='w-full mt-1 h-12 text-md'
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                        <Send className='ml-1 h-6 w-6' />
                    </Button>
                    {sheetFeedback && (
                        <p className='text-red-500 text-center text-sm mb-2'>
                            {sheetFeedback}
                        </p>
                    )}
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
