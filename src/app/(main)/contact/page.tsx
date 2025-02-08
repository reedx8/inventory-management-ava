import PagesNavBar from "@/components/pages-navbar";
import { HeaderBar } from "@/components/header-bar";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import noVendorsPic from "/public/illustrations/underConstruction.svg";
import Image from "next/image";

export default function Contact() {
    return (
        <main>
            <HeaderBar pageName={'Contact'} />
            <section>
                <PagesNavBar/>
            </section>
            <section className='flex flex-col items-center justify-center gap-2 mb-4'>
                <Image src={noVendorsPic} alt="No vendors pic" width={400} height={400}/>
                <h1 className='text-3xl text-gray-600'>Coming Soon</h1>
                <p className='text-sm text-gray-400'>There are no vendors at this time.</p>
            </section>
        </main>
    );
}