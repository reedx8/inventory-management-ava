import PagesNavBar from "@/components/pages-navbar";
import { HeaderBar } from "@/components/header-bar";
import { ComingSoon } from "@/components/placeholders";

export default function ManageHistory() {
    return (
        <main>
            <HeaderBar pageName={'Manage'} />
            <section>
                <PagesNavBar/>
            </section>
            <section className='flex justify-center'>
                <ComingSoon subtitle='No history has been created yet' />
            </section>
        </main>
    );
};