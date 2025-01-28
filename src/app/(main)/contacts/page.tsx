import PagesNavBar from "@/components/pages-navbar";
import { TodaysDate } from "@/components/todays-date";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contacts() {
    return (
        <div className='mt-6'>
            <div>
                <h1 className='text-3xl'>Contacts <TodaysDate/></h1>
            </div>
            <div className='mb-6'>
                <PagesNavBar/>
            </div>
        </div>
    );
}