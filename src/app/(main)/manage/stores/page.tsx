import PagesNavBar from "@/components/pages-navbar";
import { HeaderBar } from "@/components/header-bar";
import noStoresPic from '/public/illustrations/underConstruction.svg';
import Image from 'next/image';

export default function ManageStores() {
    return (
        <main>
            <HeaderBar pageName={'Manage'} />
            <section>
                <PagesNavBar/>
            </section>
            <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                <Image
                    src={noStoresPic}
                    alt='no stores pic'
                    width={400}
                    height={400}
                />
                <p className='text-2xl text-gray-600'>Coming Soon</p>
                <p className='text-sm text-gray-400'>
                    No stores have been created yet
                </p>
            </section>
        </main>
    );
};