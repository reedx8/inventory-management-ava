"use client"; // needed for Autoplay
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChevronRight, CalendarDays } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react";


const orderSchedule = [
  {
    day: "Monday",
    itemsDue: "Pastries"
  },
  {
    day: "Tuesday",
    itemsDue: "Pastries, CCP, Sysco"
  },
  {
    day: "Wednesday",
    itemsDue: "Pastries, CTC"
  },
  {
    day: "Thursday",
    itemsDue: "Pastries"
  },
  {
    day: "Friday",
    itemsDue: "Pastries"
  },
  {
    day: "Saturday",
    itemsDue: "Pastries"
  }, 
  {
    day: "Sunday",
    itemsDue: "Pastries"
  }
]

const invSchedule = [
  {
    day: "Monday",
    itemsDue: "Milk, Bread"
  },
  {
    day: "Tuesday",
    itemsDue: "CCP, Sysco"
  },
  {
    day: "Wednesday",
    itemsDue: "CTC"
  },
  {
    day: "Thursday",
    itemsDue: "Milk"
  }
]

function CarouselComponent(){
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel
        className="h-full"
        plugins={[plugin.current]}
      >
          <CarouselContent className='h-full'>
            <CarouselItem className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Completed Orders</CardTitle>
                  <CardDescription>Today's Completed Store Orders</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Content</p>
                  <p>Content</p>
                </CardContent>
                <CardFooter>
                  <p>Footer</p>
                </CardFooter>
              </Card>
            </CarouselItem>
            <CarouselItem className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Completed Inventory</CardTitle>
                  <CardDescription>Today's Completed Inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Content</p>
                </CardContent>
                <CardFooter>
                  <p>Footer</p>
                </CardFooter>
              </Card>
            </CarouselItem>
          </CarouselContent>
          {/* <CarouselPrevious/> */}
          {/* <CarouselNext/> */}
      </Carousel>
  )
}

export default function Home() {
  // get todays day and date
  function todaysDate(){
    const today = new Date();
    // const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // const dayOfWeek = daysOfWeek[today.getDay()];
    const month = monthsOfYear[today.getMonth()]; 
    const dayNumber = today.getDate();
    const year = today.getFullYear();

    return `${todaysDay()} ${month} ${dayNumber}, ${year}`;
  }

  function todaysDay(){
    const today = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[today.getDay()];
    return dayOfWeek;
  }

  return (
    <div className="mt-6">
      <div>
        <h1 className="text-3xl">Home <span className="text-sm p-6">{todaysDate()}</span></h1>
      </div>
      <div className="flex gap-4 mt-3 items-stretch h-auto max-h-[100px] text-sm">
        <div className="flex-1 h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Due Today</CardTitle>
            <CardDescription>Orders / Inventory Due</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content</p>
          </CardContent>
          <CardFooter>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="myTheme">
                  <CalendarDays className="h-4 w-4"/>
                  Schedule
                  <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Tabs className="text-sm">
                  <TabsList>
                    <TabsTrigger value='orders'>Orders</TabsTrigger>
                    <TabsTrigger value='inventory'>Inventory</TabsTrigger>
                  </TabsList>
                  <TabsContent value='orders' className="flex flex-col gap-1">
                      {orderSchedule.map((item) => (
                        todaysDay() === item.day ?
                          <div key={item.day} className="grid grid-cols-2">
                            <p className="font-bold">{item.day}</p>
                            <p className="font-bold">{item.itemsDue}</p>
                          </div>
                          :
                          <div key={item.day} className="grid grid-cols-2">
                            <p>{item.day}</p>
                            <p>{item.itemsDue}</p>
                          </div>
                      ))}
                  </TabsContent>
                  <TabsContent value='inventory' className="flex flex-col gap-1">
                    {invSchedule.map((item) => (
                      todaysDay() === item.day ?
                      <div key={item.day} className="grid grid-cols-2">
                        <p className="font-bold">{item.day}</p>
                        <p className="font-bold">{item.itemsDue}</p>
                        {/* <Separator/> */}
                      </div>
                      :
                      <div key={item.day} className="grid grid-cols-2">
                        <p>{item.day}</p>
                        <p>{item.itemsDue}</p>
                        {/* <Separator/> */}
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
                
          </CardFooter>
        </Card>
        </div>
        <div className="flex-1 h-full">
          {CarouselComponent()}
        </div>
      </div>
    </div>
  );
}
