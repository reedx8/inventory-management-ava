import PagesNavBar from "@/components/pages-navbar";
import { HeaderBar } from "@/components/header-bar";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import noStaffPic from "/public/illustrations/underConstruction.svg";
import Image from "next/image";

export default function Staff(){
    return (
        <div className="mt-6">
            <HeaderBar pageName={'Contacts'} />
            <div className="mb-6">
                <PagesNavBar/>
            </div>
            <div className='flex flex-col items-center justify-center gap-2 mb-4'>
                <Image src={noStaffPic} alt="No vendors pic" width={400} height={400}/>
                <h1 className='text-3xl text-gray-600'>Coming Soon</h1>
                <p className='text-sm text-gray-400'>There are no staff members at this time</p>
            </div>
        </div>
    )
};