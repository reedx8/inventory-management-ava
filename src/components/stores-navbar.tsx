"use client" // for shadcn navigation menu
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

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
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        <Link href={item.url} legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
      </NavigationMenu>
    )
}