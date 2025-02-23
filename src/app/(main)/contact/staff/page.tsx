import PagesNavBar from '@/components/pages-navbar';
import { HeaderBar } from '@/components/header-bar';
import { ComingSoon } from '@/components/placeholders';

export default function Staff() {
    return (
        <main className=''>
            <HeaderBar pageName={'Contact'} />
            <section>
                <PagesNavBar />
            </section>
            <section className='flex justify-center'>
                <ComingSoon subtitle='There are no staff members added yet' />
            </section>
        </main>
    );
}
