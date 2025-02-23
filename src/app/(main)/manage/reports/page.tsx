// 'use client';
// import React, { useState, useEffect } from 'react';
import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
import { ComingSoon } from '@/components/placeholders';

export default function ManageReports() {
    // const [data, setData] = useState<Item[]>([]);
    return (
        <main>
            <HeaderBar pageName={'Manage'} />
            <section>
                <PagesNavBar />
            </section>
            <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                <ComingSoon subtitle='No reports have been created yet' />
            </section>
        </main>
    );
}
