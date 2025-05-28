import Image from 'next/image';
import constructionPic from '/public/illustrations/underConstruction.svg';
import noPastriesPic from '/public/illustrations/cooking.svg';
import noStockPic from '/public/illustrations/empty.svg';
import baristaPic from '/public/illustrations/barista.svg';
import wellDone from '/public/illustrations/wellDone.svg';
import noMilkBreadPic from '/public/illustrations/groceries.svg';

// Coming soon placeholder
export function ComingSoon({ subtitle }: { subtitle: string }) {
    return (
        <div className='w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] flex flex-col items-center justify-center gap-1 bg-white p-2 rounded-2xl shadow-md mt-2'>
            <Image
                src={constructionPic}
                alt='under construction placeholder picture'
                width={400}
                height={400}
                // style={{width: 300, height: 300}}
            />
            <h1 className='text-2xl sm:text-3xl text-gray-600'>Coming Soon</h1>
            <p className='text-xs sm:text-sm text-gray-400'>{subtitle}</p>
        </div>
    );
}

// No orders placeholder (order manager)
export function NoOrders({ subtitle }: { subtitle: string }) {
    return (
        <div className='w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex flex-col items-center justify-center gap-2 bg-white p-2 rounded-2xl shadow-md mt-2'>
            <Image
                src={wellDone}
                alt='all orders complete pic'
                width={200}
                height={200}
                // className='rounded-3xl'
                // style={{ width: 250, height: 250 }}
                priority
            />
            <p className='text-xl sm:text-2xl text-gray-600'>
                All Orders Completed!
            </p>
            <p className='text-xs sm:text-sm text-gray-400'>{subtitle}</p>
            {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
        </div>
    );
}

// No pastries due placeholder
export function NoPastriesDue() {
    return (
        <div className='w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex flex-col items-center justify-center gap-1 bg-white p-2 rounded-2xl shadow-md mt-2'>
            <Image
                src={noPastriesPic}
                alt='no pastries picture'
                width={250}
                height={250}
                // className='rounded-3xl'
                // style={{ width: 250, height: 250 }}
                priority
            />
            <p className='text-xl sm:text-2xl text-gray-600'>
                No Pastries Due!
            </p>
            <p className='text-xs sm:text-sm text-gray-400'>
                No pastries are currently due
            </p>
            {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
        </div>
    );
}

export function NoStockDue() {
    return (
        <div className='w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex flex-col items-center justify-center gap-1 bg-white p-2 rounded-2xl shadow-md mt-2'>
            <Image
                src={noStockPic}
                alt='no stock counts due today pic'
                width={300}
                height={300}
                className='drop-shadow-lg'
            />
            <p className='text-xl sm:text-2xl text-gray-600'>No CTC/CCP Stock Due!</p>
            <p className='text-xs sm:text-sm text-gray-400'>
                All stock counts have been sent
            </p>
        </div>
    );
}

export function NoStoreOrdersDue() {
    return (
        <div className='w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex flex-col items-center justify-center gap-1 bg-white p-2 rounded-2xl shadow-md mt-2'>
            <Image
                src={baristaPic}
                alt='no orders due today pic'
                width={175}
                height={175}
                // style={{ width: '200px', height: '200px' }}
                className='drop-shadow-lg'
            />
            <p className='text-xl sm:text-2xl text-gray-600'>No Orders Due!</p>
            <p className='text-xs sm:text-sm text-gray-400'>
                All orders have been sent
            </p>
            {/* <p className='text-sm text-gray-400'>
        Create an order below if needed
    </p>
    <Button size='lg' variant='myTheme'>
        Create Order
    </Button> */}
        </div>
    );
}

export function NoMilkBreadDue() {
    return (
        <div className='w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex flex-col items-center justify-center gap-1 bg-white p-2 rounded-2xl shadow-md mt-2'>
        {/* <div className='flex flex-col items-center justify-center gap-2 mb-4'> */}
            <Image
                src={noMilkBreadPic}
                alt='no milk & bread orders pic'
                width={250}
                height={250}
                className='drop-shadow-lg'
            />
            <p className='text-xl sm:text-2xl text-gray-600'>
                No Milk & Bread Orders!
            </p>
            <p className='text-xs sm:text-sm text-gray-400'>
                All orders have been completed
            </p>
            {/* <Button size='lg' variant='myTheme'>Create Order</Button> */}
        </div>
    );
}
