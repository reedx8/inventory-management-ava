import PagesNavBar from "@/components/pages-navbar";
import { TodaysDate } from "@/components/todays-date";
import noHistoryPic from '/public/illustrations/underConstruction.svg';
import Image from 'next/image';

export default function ManageHistory() {
    return (
        <div className='mt-6'>
            <div>
                <h1 className='text-3xl'>Manage <TodaysDate/></h1>
            </div>
            <div className='mb-6'>
                <PagesNavBar/>
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                <Image
                    src={noHistoryPic}
                    alt='no history pic'
                    width={400}
                    height={400}
                />
                <p className='text-2xl text-gray-600'>Coming Soon</p>
                <p className='text-sm text-gray-400'>
                    No history has been created yet
                </p>
            </div>
        </div>
    );
};