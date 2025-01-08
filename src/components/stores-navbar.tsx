"use client" // for shadcn navigation menu
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
    {
        title: "Orders Due",
        url: "/store",
    },
    {
        title: "Inventory",
        url: "/store/inventory",
    },
    // { TODO
    //     title: "Pars",
    //     url: "/store/pars"
    // }, 
    /* TODO
        title: "Overview",
        url: "/stores/overview"
    */
];

export default function StoreNavsBar(){
    const [currentPage, setCurrentPage] = useState('/')
    const pathname= usePathname();
    useEffect(() => {
        // console.log("path: " + pathname.split('/')[2]);
        // console.log("path: " + pathname);
        setCurrentPage(pathname);
    }, [pathname]);

    // console.log(currentPage);

    return (
        <NavigationMenu className="my-4 border rounded-sm py-2 px-1">
            <NavigationMenuList>
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        <Link href={item.url} legacyBehavior passHref>
                            {/* <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-extrabold`}>{item.title}</NavigationMenuLink> */}
                            {/* <NavigationMenuLink className={currentPage === item.url ? `${navigationMenuTriggerStyle()} bg-myBrown` : navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink> */}
                            <NavigationMenuLink className={currentPage === item.url ?'bg-myBrown rounded-sm p-2 text-sm' : 'rounded-sm p-2 hover:bg-gray-100 text-sm hover:text-gray-800'}>{item.title}</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
      </NavigationMenu>
    )
}