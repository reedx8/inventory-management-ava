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
import { HeaderBar, todaysDay} from "@/components/header-bar";


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
                  <CardTitle>Completed stock</CardTitle>
                  <CardDescription>Today's Completed stock</CardDescription>
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
  return (
    <div className="mt-6">
      <HeaderBar pageName={'Home'} />
      <div className="flex gap-4 mt-3 items-stretch text-sm">
        <div className="flex-1 h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Due Today</CardTitle>
            <CardDescription>Orders & Stock Due Today</CardDescription>
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
                    <TabsTrigger value='stock'>Stock</TabsTrigger>
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
                  <TabsContent value='stock' className="flex flex-col gap-1">
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
