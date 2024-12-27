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
        title: "inventory",
        url: "/store/inventory",
    },
    {
        title: "Pars",
        url: "/store/pars"
    }, 
    /* TODO
        title: "Overview",
        url: "/stores/overview"
    */
];

export default function StoreNavsBar(){
    const [currentPage, setCurrentPage] = useState('/')
    const pathname= usePathname();
    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);

    console.log(currentPage);

    return (
        <NavigationMenu className="mt-2">
            <NavigationMenuList>
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        <Link href={item.url} legacyBehavior passHref>
                            {/* <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-extrabold`}>{item.title}</NavigationMenuLink> */}
                            <NavigationMenuLink className={currentPage === item.url ? `${navigationMenuTriggerStyle()} bg-gray-200` : navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
      </NavigationMenu>
    )
}