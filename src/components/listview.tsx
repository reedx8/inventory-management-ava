import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import placeholder from '/public/placeholder.jpg';
import Image from 'next/image';
import {
    Beef,
    Coffee,
    Dessert,
    Milk,
    // Search,
    Wheat,
    Utensils,
} from 'lucide-react';
import redDot from '/public/icons/redDot.png';
import greenDot from '/public/icons/greenDot.png';
// import verticalLine from '/public/verticalLine.png';
import { Badge } from '@/components/ui/badge';

export default function ListView({ data }: { data: any }) {
    return (
        <div>
            <ScrollArea className='h-[60vh] md:h-[70vh] overflow-y-auto py-3 pr-3'>
                <div className='flex flex-col gap-3 h-full'>
                    {data.map((order: any) => (
                        <Button
                            asChild
                            key={order.orderNumber}
                            className='w-full min-h-[90px] p-0 m-0'
                            variant='link2'
                            // onClick={() => openOrder(order.orderNumber)}
                        >
                            <Card
                                className='w-full h-full py-1 shadow-md hover:-translate-y-1 duration-300'
                            >
                                <OrderCardDetails order={order} />
                            </Card>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

function OrderCardDetails({ order }: { order: any }) {
    return (
        <CardContent className='flex flex-col gap-2 w-full'>
            {/* Order Header */}
            <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center gap-2'>
                    <h2 className='text-lg font-medium'>Order # {order.orderNumber}</h2>
                    {selectIcon(order.cron_categ ?? 'PASTRY')}
                </div>
                <div className='text-sm text-neutral-500'>
                    <p>
                        <span className='font-bold'>Customer:</span> {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </p>
                </div>
            </div>
            
            {/* Customer Details */}
            <div className='grid grid-cols-2 gap-2 text-sm text-neutral-500 mb-2'>
                <p>
                    <span className='font-bold'>Phone:</span>{' '}
                    {order.billingAddress.phone === '' ? '--' : order.billingAddress.phone}
                </p>
                <p>
                    <span className='font-bold'>Pickup Location:</span>{' '}
                    {order.formSubmission && (order.formSubmission[1].value === '' ? '--' : order.formSubmission[1].value)}
                </p>
            </div>
            
            {/* Order Items */}
            <div className='border-t pt-2'>
                <h3 className='text-sm font-medium mb-2'>Order Items:</h3>
                <div className='flex flex-col gap-2'>
                    {order.lineItems.map((item: any) => (
                        <div key={item.id} className='grid grid-cols-[40px_1fr] gap-4 py-1 border-b last:border-b-0'>
                            <div className='flex justify-center items-center'>
                                <Image
                                    src={item.imageUrl}
                                    alt='item pic'
                                    width={40}
                                    height={40}
                                    className='rounded-lg'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-2'>
                                    <p className='font-medium'>{item.productName}</p>
                                </div>
                                <div className='flex flex-col items-start text-xs text-neutral-500'>
                                    <p>
                                        <span className='font-bold'>Size:</span>{' '}
                                        {item.variantOptions[0].value ?? '--'}
                                    </p>
                                    {order.formSubmission && order.formSubmission[2]?.value && (
                                        <p>
                                            <span className='font-bold'>Decoration:</span>{' '}
                                            {order.formSubmission[2].value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
    );
}

function ItemCardDetails(item: any) {
    return (
        <CardContent className='grid grid-cols-[auto_1fr] gap-8 w-full'>
            <div className='flex flex-col justify-center items-center'>
                <Image
                    src={placeholder}
                    alt='placeholder logo'
                    width={50}
                    height={50}
                    className='rounded-lg'
                />
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-lg flex items-center gap-1'>
                        {item.is_active ? (
                            <Image
                                src={greenDot}
                                alt='enabled'
                                width={15}
                            />
                        ) : (
                            <Image src={redDot} alt='disabled' width={15} />
                        )}
                    </h2>
                    {selectIcon(item.cron_categ ?? 'PASTRY')}
                    <Badge
                        variant='secondary'
                        className='text-xs text-myDarkbrown font-light bg-myBrown'
                    >
                        {item.invoice_categ ?? ''}
                    </Badge>
                </div>
                <div className='flex flex-col items-start'>
                    <p className='text-xs text-neutral-500'>
                        Vendor:{' '}
                        <span className='text-neutral-500'>
                            {item.vendor_name ?? '--'}
                        </span>
                    </p>
                    <p className='text-xs text-wrap text-neutral-500'>
                        Unit:{' '}
                        <span className='text-neutral-500'>
                            {item.units ?? '--'}
                        </span>
                    </p>
                </div>
            </div>
        </CardContent>
    );
}

// Uses cron_categ
function selectIcon(categ: string | undefined) {
    const iconStyle = 'text-myBrown w-5 h-5';
    if (categ === 'MILK') {
        return <Milk className={iconStyle} />;
    } else if (categ === 'PASTRY') {
        return <Dessert className={iconStyle} />;
    } else if (categ === 'RETAILBEANS') {
        return <Coffee className={iconStyle} />;
    } else if (categ === 'MEATS') {
        return <Beef className={iconStyle} />;
    } else if (categ === 'BREAD') {
        return <Wheat className={iconStyle} />;
    } else {
        return <Utensils className={iconStyle} />;
    }
}

// export default function ListView({ data }: { data: any }) {
//     return (
//         <div>
//             <ScrollArea className='h-[60vh] md:h-[70vh] overflow-y-auto py-3 pr-3'>
//                 <div className='flex flex-col gap-3 h-full'>
//                     {data.map(
//                         (
//                             order: any // ie cakeOrders.map((order) => (
//                         ) =>
//                             order.lineItems.map((item: any) => (
//                                 <Button
//                                     asChild
//                                     key={item.id}
//                                     className='w-full min-h-[90px] p-0 m-0'
//                                     variant='link2'
//                                     // onClick={() => openItem(item.id)}
//                                 >
//                                     {/* <Link href={`?itemId=${item.id}`}> */}
//                                     <Card
//                                         className='w-full h-full py-1 shadow-md hover:-translate-y-1 duration-300'
//                                         // className='w-full h-[90px] py-1 hover:-translate-y-2 hover:bg-neutral-50 duration-300 shadow-md'
//                                         // key={item.id}
//                                     >
//                                         {CakeCardDetails(order, item)}
//                                     </Card>
//                                     {/* </Link> */}
//                                 </Button>
//                             ))
//                     )}
//                 </div>
//             </ScrollArea>
//         </div>
//     );
// }

// function CakeCardDetails(order: any, item: any) {
//     return (
//         <CardContent className='grid grid-cols-[40px_1fr] gap-8 w-full'>
//             <div className='flex flex-col justify-center items-center'>
//                 <Image
//                     src={item.imageUrl}
//                     alt='item pic'
//                     width={40}
//                     height={40}
//                     className='rounded-lg'
//                 />
//             </div>
//             <div className='flex flex-col'>
//                 <div className='flex justify-between items-center'>
//                     <div className='flex items-center gap-4'>
//                         <h2 className='text-lg flex items-center gap-1'>
//                             {item.productName}
//                         </h2>
//                         {selectIcon(order.cron_categ ?? 'PASTRY')}
//                     </div>
//                     <p className='text-sm'>Order # {order.orderNumber}</p>
//                 </div>
//                 <div className='flex flex-col items-start'>
//                     <div className='text-sm text-neutral-500 flex gap-2'>
//                         <p>
//                             <span className='font-bold'>Customer Name</span>:{' '}
//                             {order.billingAddress.firstName}{' '}
//                             {order.billingAddress.lastName}
//                         </p>
//                         <p>
//                             (Phone #:{' '}
//                             {order.billingAddress.phone === ''
//                                 ? '--'
//                                 : order.billingAddress.phone}
//                             )
//                         </p>
//                     </div>
//                     <div className='text-sm text-wrap text-neutral-500 flex gap-2'>
//                         <p className='font-bold'>Pickup Location:</p>
//                         <p>
//                             {order.formSubmission &&
//                                 (order.formSubmission[1].value === ''
//                                     ? '--'
//                                     : order.formSubmission[1].value)}
//                         </p>
//                     </div>
//                     <div className='text-sm text-wrap text-neutral-500 flex gap-2'>
//                         <p className='font-bold'>Size:</p>
//                         <p>
//                             {order.lineItems[0].variantOptions[0].value ?? '--'}
//                         </p>
//                     </div>
//                     <div className='text-sm text-wrap text-neutral-500 flex gap-2'>
//                         <p className='font-bold'>Decoration Details:</p>
//                         <p>
//                             {order.formSubmission &&
//                                 (order.formSubmission[2]?.value === ''
//                                     ? '--'
//                                     : order.formSubmission[2]?.value)}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </CardContent>
//     );
// }

// function ItemCardDetails(item: any) {
//     return (
//         <CardContent className='grid grid-cols-[auto_1fr] gap-8 w-full'>
//             {/* <CardContent className='flex w-full gap-8'> */}
//             {/* <CardContent className='grid grid-cols-[auto_1fr] gap-8'> */}
//             <div className='flex flex-col justify-center items-center'>
//                 <Image
//                     src={placeholder}
//                     alt='placeholder logo'
//                     width={50}
//                     height={50}
//                     className='rounded-lg'
//                 />
//             </div>
//             <div className='flex flex-col'>
//                 <div className='flex items-center gap-4'>
//                     <h2 className='text-lg flex items-center gap-1'>
//                         {item.is_active ? (
//                             <Image
//                                 src={greenDot}
//                                 alt='enabled'
//                                 width={15}
//                                 // height={10}
//                             />
//                         ) : (
//                             <Image src={redDot} alt='disabled' width={15} />
//                         )}
//                     </h2>
//                     {selectIcon(item.cron_categ ?? 'PASTRY')}
//                     <Badge
//                         variant='secondary'
//                         className='text-xs text-myDarkbrown font-light bg-myBrown'
//                     >
//                         {item.invoice_categ ?? ''}
//                     </Badge>
//                 </div>
//                 <div className='flex flex-col items-start'>
//                     <p className='text-xs text-neutral-500'>
//                         Vendor:{' '}
//                         <span className='text-neutral-500'>
//                             {item.vendor_name ?? '--'}
//                         </span>
//                     </p>
//                     <p className='text-xs text-wrap text-neutral-500'>
//                         Unit:{' '}
//                         <span className='text-neutral-500'>
//                             {item.units ?? '--'}
//                         </span>
//                     </p>
//                 </div>
//             </div>
//         </CardContent>
//     );
// }

// // Uses cron_categ
// function selectIcon(categ: string | undefined) {
//     const iconStyle = 'text-myBrown w-5 h-5';
//     if (categ === 'MILK') {
//         return <Milk className={iconStyle} />;
//     } else if (categ === 'PASTRY') {
//         return <Dessert className={iconStyle} />;
//     } else if (categ === 'RETAILBEANS') {
//         return <Coffee className={iconStyle} />;
//     } else if (categ === 'MEATS') {
//         return <Beef className={iconStyle} />;
//     } else if (categ === 'BREAD') {
//         return <Wheat className={iconStyle} />;
//     } else {
//         return <Utensils className={iconStyle} />;
//     }
// }
