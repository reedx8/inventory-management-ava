// 'use client';
// import React, { useState, useEffect } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import { TodaysDate } from '@/components/todays-date';
import noReportsPic from '/public/illustrations/underConstruction.svg';
import Image from 'next/image';

export default function ManageReports() {
    // const [data, setData] = useState<Item[]>([]);
    return (
        <div className='mt-6'>
            <div>
                <h1 className='text-3xl'>
                    Manage <TodaysDate />
                </h1>
            </div>
            <div className='mb-6'>
                <PagesNavBar />
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                <Image
                    src={noReportsPic}
                    alt='no reports pic'
                    width={300}
                    height={300}
                />
                <p className='text-xl text-gray-600'>Coming Soon</p>
                <p className='text-sm text-gray-400'>
                    No reports have been created yet
                </p>
                {/* <Button size='lg' variant='myTheme'>Create Report</Button> */}
            </div>
        </div>
    );
}
