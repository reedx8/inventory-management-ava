import Image from 'next/image';
import constructionPic from '/public/illustrations/underConstruction.svg';
import noOrdersPic from '/public/illustrations/emptyCart.svg';
import noPastriesPic from '/public/illustrations/cooking.svg';
import noStockPic from '/public/illustrations/empty.svg';

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

// No orders placeholder
export function NoOrders({ subtitle }: { subtitle: string }) {
    return (
        <div className='w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex flex-col items-center justify-center gap-2 bg-white p-2 rounded-2xl shadow-md mt-2'>
            <Image
                src={noOrdersPic}
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

// No passtries due placeholder
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
            <p className='text-xl sm:text-2xl text-gray-600'>No Stock Due!</p>
            <p className='text-xs sm:text-sm text-gray-400'>
                All stock counts have been sent
            </p>
        </div>
    );
}
